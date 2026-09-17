import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { parse } from 'yaml';

const definitionsRoot = path.resolve(process.argv[2] ?? 'config-schema/definitions');
const outputRoot = path.resolve(process.argv[3] ?? 'config-schema/generated');

function findYamlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) => {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) return findYamlFiles(fullPath);
      return /\.ya?ml$/i.test(entry.name) ? [fullPath] : [];
    })
    .sort();
}

function expandCompactSyntax(value) {
  if (Array.isArray(value)) return value.map(expandCompactSyntax);
  if (!value || typeof value !== 'object') return value;

  const expanded = {};
  Object.entries(value).forEach(([key, rawValue]) => {
    let nextValue = expandCompactSyntax(rawValue);

    // Compact enum authoring:
    // oneOf:
    //   horizontal: Horizontal line.
    //   vertical: Vertical line.
    // becomes ordinary JSON Schema const branches.
    if (key === 'oneOf' && nextValue && !Array.isArray(nextValue) && typeof nextValue === 'object') {
      nextValue = Object.entries(nextValue).map(([constant, description]) => ({ const: constant, description }));
    }

    // Definition files use stable symbolic references. Only the generated schema
    // needs JSON-Schema-local #/$defs paths.
    if (key === '$ref' && typeof nextValue === 'string' && !nextValue.startsWith('#') && !nextValue.includes('://')) {
      nextValue = `#/$defs/${nextValue}`;
    }

    expanded[key] = nextValue;
  });
  return expanded;
}




function resolveDefinitionRef(schema, definitions) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return schema;
  const ref = schema.$ref;
  if (typeof ref === 'string' && ref.startsWith('#/$defs/')) {
    return definitions[ref.slice('#/$defs/'.length)] ?? schema;
  }
  return schema;
}

function mergePropertySchema(current, candidate) {
  if (!current) return candidate;
  if (JSON.stringify(current) === JSON.stringify(candidate)) return current;
  const currentBranches = current.anyOf && Object.keys(current).length === 1 ? current.anyOf : [current];
  const candidates = [...currentBranches, candidate];
  const unique = [];
  const seen = new Set();
  candidates.forEach((item) => {
    const marker = JSON.stringify(item);
    if (!seen.has(marker)) {
      seen.add(marker);
      unique.push(item);
    }
  });
  return { anyOf: unique };
}

function collectKnownProperties(schema, definitions, seen = new Set()) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return {};

  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const id = schema.$ref.slice('#/$defs/'.length);
    if (seen.has(id)) return {};
    const target = definitions[id];
    if (!target) return {};
    const nextSeen = new Set(seen);
    nextSeen.add(id);
    return collectKnownProperties(target, definitions, nextSeen);
  }

  const properties = {};
  if (schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)) {
    Object.entries(schema.properties).forEach(([name, definition]) => {
      properties[name] = mergePropertySchema(properties[name], definition);
    });
  }

  ['allOf', 'anyOf', 'oneOf'].forEach((keyword) => {
    if (!Array.isArray(schema[keyword])) return;
    schema[keyword].forEach((branch) => {
      const branchProperties = collectKnownProperties(branch, definitions, seen);
      Object.entries(branchProperties).forEach(([name, definition]) => {
        properties[name] = mergePropertySchema(properties[name], definition);
      });
    });
  });

  return properties;
}

function schemaAllowsNumericTarget(schema, definitions, seen = new Set()) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return false;

  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const id = schema.$ref.slice('#/$defs/'.length);
    if (id === 'common.entityIndex') return true;
    if (seen.has(id)) return false;
    const target = definitions[id];
    if (!target) return false;
    const nextSeen = new Set(seen);
    nextSeen.add(id);
    return schemaAllowsNumericTarget(target, definitions, nextSeen);
  }

  const types = Array.isArray(schema.type) ? schema.type : [schema.type];
  if (types.includes('number') || types.includes('integer')) return true;

  return ['allOf', 'anyOf', 'oneOf'].some((keyword) =>
    Array.isArray(schema[keyword])
      && schema[keyword].some((branch) => schemaAllowsNumericTarget(branch, definitions, seen)));
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sameAsDeltaPattern(properties, definitions) {
  const targets = Object.entries(properties)
    .filter(([name, definition]) => !name.startsWith('same_as') && schemaAllowsNumericTarget(definition, definitions))
    .map(([name]) => name)
    .sort();
  if (!targets.length) return null;
  return `^same_as_d(?:${targets.map(escapeRegex).join('|')})$`;
}

function schemaClosesObjectAtThisLevel(schema, definitions, seen = new Set()) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return false;

  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const id = schema.$ref.slice('#/$defs/'.length);
    if (seen.has(id)) return false;
    const target = definitions[id];
    if (!target) return false;
    const nextSeen = new Set(seen);
    nextSeen.add(id);
    return schemaClosesObjectAtThisLevel(target, definitions, nextSeen);
  }

  if (schema.additionalProperties === false || schema.unevaluatedProperties === false) return true;
  return ['allOf', 'anyOf', 'oneOf'].some((keyword) =>
    Array.isArray(schema[keyword])
      && schema[keyword].some((branch) => schemaClosesObjectAtThisLevel(branch, definitions, seen)));
}

function schemaContainsRequired(schema, definitions, seen = new Set()) {
  if (!schema || typeof schema !== 'object' || Array.isArray(schema)) return false;

  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const id = schema.$ref.slice('#/$defs/'.length);
    if (seen.has(id) || !definitions[id]) return false;
    const nextSeen = new Set(seen);
    nextSeen.add(id);
    return schemaContainsRequired(definitions[id], definitions, nextSeen);
  }

  if (Array.isArray(schema.required) && schema.required.length > 0) return true;
  if (schema.properties && typeof schema.properties === 'object' && !Array.isArray(schema.properties)) {
    if (Object.values(schema.properties).some((child) => schemaContainsRequired(child, definitions, seen))) return true;
  }
  return ['allOf', 'anyOf', 'oneOf'].some((keyword) =>
    Array.isArray(schema[keyword])
      && schema[keyword].some((branch) => schemaContainsRequired(branch, definitions, seen)));
}

function partializeNestedObjectSchema(schema, definitions, seen = new Set()) {
  if (Array.isArray(schema)) return schema.map((item) => partializeNestedObjectSchema(item, definitions, seen));
  if (!schema || typeof schema !== 'object') return schema;

  // Schemas with no required contract need no partial variant. Keep their refs
  // intact so generated same_as branches stay compact and readable.
  if (!schemaContainsRequired(schema, definitions)) return structuredClone(schema);

  // same_as uses Merge.mergeDeep for nested objects. For an override branch,
  // required keys inside those nested objects may therefore be inherited from
  // the referenced item. Expand local refs while building this authoring-only
  // partial schema so the normal standalone definitions stay strict. Arrays are
  // intentionally left alone: their runtime merge semantics remain JavaScript's
  // responsibility and are not reproduced by the schema generator.
  if (schema.$ref && typeof schema.$ref === 'string' && schema.$ref.startsWith('#/$defs/')) {
    const id = schema.$ref.slice('#/$defs/'.length);
    if (seen.has(id) || !definitions[id]) return structuredClone(schema);
    const nextSeen = new Set(seen);
    nextSeen.add(id);
    const expanded = partializeNestedObjectSchema(definitions[id], definitions, nextSeen);
    const overlay = Object.fromEntries(
      Object.entries(schema)
        .filter(([key]) => key !== '$ref')
        .map(([key, value]) => [key, structuredClone(value)]),
    );
    return { ...expanded, ...overlay };
  }

  const partial = structuredClone(schema);
  delete partial.required;

  if (partial.properties && typeof partial.properties === 'object' && !Array.isArray(partial.properties)) {
    Object.entries(partial.properties).forEach(([name, child]) => {
      partial.properties[name] = partializeNestedObjectSchema(child, definitions, seen);
    });
  }

  if (partial.patternProperties && typeof partial.patternProperties === 'object' && !Array.isArray(partial.patternProperties)) {
    Object.entries(partial.patternProperties).forEach(([name, child]) => {
      partial.patternProperties[name] = partializeNestedObjectSchema(child, definitions, seen);
    });
  }

  ['allOf', 'anyOf', 'oneOf'].forEach((keyword) => {
    if (Array.isArray(partial[keyword])) {
      partial[keyword] = partial[keyword].map((branch) => partializeNestedObjectSchema(branch, definitions, seen));
    }
  });

  return partial;
}

function buildSameAsOverride(definition, definitions, id) {
  const properties = collectKnownProperties(definition, definitions, new Set([id]));
  const partialProperties = Object.fromEntries(
    Object.entries(properties).map(([name, propertySchema]) => [
      name,
      name === 'same_as'
        ? structuredClone(propertySchema)
        : partializeNestedObjectSchema(propertySchema, definitions),
    ]),
  );
  const pattern = sameAsDeltaPattern(properties, definitions);
  const override = {
    type: 'object',
    properties: partialProperties,
    required: ['same_as'],
    additionalProperties: false,
  };
  if (pattern) override.patternProperties = { [pattern]: { $ref: '#/$defs/common.sameAsDelta' } };
  return override;
}

function splitReuseMetadata(definition) {
  const normal = structuredClone(definition);
  const metadata = {};
  ['description', 'x-fhs-semantic-source'].forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(normal, key)) {
      metadata[key] = normal[key];
      delete normal[key];
    }
  });
  return { normal, metadata };
}

function applyReuseOverrideDirective(override, directive) {
  if (!directive) return override;
  const patched = structuredClone(override);
  const properties = patched.properties ?? {};

  (directive.exclude_properties ?? []).forEach((name) => {
    delete properties[name];
  });
  Object.entries(directive.properties ?? {}).forEach(([name, definition]) => {
    properties[name] = expandCompactSyntax(definition);
  });

  patched.properties = properties;
  return patched;
}

function applyReuseSemantics(definitions, reuseOverrides = {}) {
  // Reuse is public YAML syntax. Generate a separate same_as authoring branch
  // for each closed public layout-item contract. Definition-level metadata is
  // kept on the public definition while the normal branch remains structural.
  Object.entries(definitions).forEach(([id, definition]) => {
    if (!id.startsWith('layout.') || id.startsWith('layout.control')) return;
    const properties = collectKnownProperties(definition, definitions, new Set([id]));
    if (!Object.prototype.hasOwnProperty.call(properties, 'same_as')) return;
    if (!schemaClosesObjectAtThisLevel(definition, definitions, new Set([id]))) return;

    const { normal, metadata } = splitReuseMetadata(definition);
    if (schemaContainsRequired(normal, definitions, new Set([id]))) {
      definitions[id] = {
        anyOf: [buildSameAsOverride(normal, definitions, id), normal],
        ...metadata,
      };
      return;
    }

    const pattern = sameAsDeltaPattern(properties, definitions);
    if (pattern) {
      definition.patternProperties = {
        ...(definition.patternProperties ?? {}),
        [pattern]: { $ref: '#/$defs/common.sameAsDelta' },
      };
    }
  });

  // Controls are polymorphic. A same_as override intentionally has no type, so
  // it must bypass the type-discriminated oneOf while still validating every
  // supplied override field against the union of known control properties.
  const control = definitions['layout.control'];
  if (control) {
    const { normal, metadata } = splitReuseMetadata(control);
    definitions['layout.control'] = {
      anyOf: [buildSameAsOverride(normal, definitions, 'layout.control'), normal],
      ...metadata,
    };
  }

  // Compatibility deltas are source-controlled and applied only after all
  // derived reuse branches have been built, so one historical branch cannot
  // influence derivation of another tool's branch.
  Object.entries(reuseOverrides).forEach(([id, directive]) => {
    const definition = definitions[id];
    if (!definition || !Array.isArray(definition.anyOf) || !definition.anyOf.length) {
      throw new Error(`Reuse override target '${id}' is not a generated same_as definition`);
    }
    definition.anyOf[0] = applyReuseOverrideDirective(definition.anyOf[0], directive);
  });
}

function collectRefs(value, refs = []) {
  if (Array.isArray(value)) {
    value.forEach((item) => collectRefs(item, refs));
    return refs;
  }
  if (!value || typeof value !== 'object') return refs;

  Object.entries(value).forEach(([key, child]) => {
    if (key === '$ref' && typeof child === 'string' && child.startsWith('#/$defs/')) {
      refs.push(child.slice('#/$defs/'.length));
    } else {
      collectRefs(child, refs);
    }
  });
  return refs;
}

const files = findYamlFiles(definitionsRoot);
const defs = {};
const sourceMap = {};
const authoring = {};
const authoringRoot = {};
const reuseOverrides = {};
let rootSchema;

files.forEach((file) => {
  const source = parse(fs.readFileSync(file, 'utf8'));
  const relative = path.relative(definitionsRoot, file).replaceAll(path.sep, '/');

  if (source.root) {
    if (rootSchema) throw new Error(`Multiple root schemas: ${relative}`);
    rootSchema = expandCompactSyntax(source.schema);
  }

  if (source.definitions) {
    if (!source.namespace) throw new Error(`${relative}: definitions require namespace`);
    Object.entries(source.definitions).forEach(([name, definition]) => {
      const id = `${source.namespace}.${name}`;
      if (defs[id]) throw new Error(`Duplicate definition '${id}' in ${relative}`);
      defs[id] = expandCompactSyntax(definition);
      sourceMap[id] = relative;
    });
  }

  if (source.authoring) authoring[relative] = source.authoring;

  if (source.authoring_root && typeof source.authoring_root === 'object') {
    Object.assign(authoringRoot, source.authoring_root);
  }

  if (source.generation?.reuse_overrides) {
    if (!source.namespace) throw new Error(`${relative}: reuse_overrides require namespace`);
    Object.entries(source.generation.reuse_overrides).forEach(([name, directive]) => {
      reuseOverrides[`${source.namespace}.${name}`] = directive;
    });
  }

});

if (!rootSchema) throw new Error('No root: true schema definition found');

applyReuseSemantics(defs, reuseOverrides);

const allRefs = [...collectRefs(rootSchema), ...Object.values(defs).flatMap((definition) => collectRefs(definition))];
const unresolved = [...new Set(allRefs.filter((ref) => defs[ref] === undefined))].sort();
if (unresolved.length) {
  throw new Error(`Unresolved schema references:\n${unresolved.map((ref) => `  - ${ref}`).join('\n')}`);
}

Object.assign(authoring, authoringRoot);

const schema = {
  $schema: 'https://json-schema.org/draft/2020-12/schema',
  $id: 'https://flexible-horseshoe-card-manual.amoebelabs.com/schema/fhs.schema.json',
  ...rootSchema,
  $defs: defs,
};

fs.mkdirSync(outputRoot, { recursive: true });
fs.writeFileSync(path.join(outputRoot, 'fhs.schema.json'), `${JSON.stringify(schema, null, 2)}\n`);
fs.writeFileSync(path.join(outputRoot, 'fhs.authoring.json'), `${JSON.stringify(authoring, null, 2)}\n`);
fs.writeFileSync(path.join(outputRoot, 'fhs.definition-sources.json'), `${JSON.stringify(sourceMap, null, 2)}\n`);
console.log(`Generated ${Object.keys(defs).length} definitions from ${files.length} YAML files.`);
