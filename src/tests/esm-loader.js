import { readFile } from 'node:fs/promises';
import ts from 'typescript';

/** Resolves the browser-oriented extensionless imports used by FHS source tests. */
export async function resolve(specifier, context, nextResolve) {
  try {
    return await nextResolve(specifier, context);
  } catch (error) {
    if (!specifier.startsWith('.') || specifier.match(/\.[a-z]+$/i)) throw error;

    try {
      return await nextResolve(`${specifier}.js`, context);
    } catch {
      return nextResolve(`${specifier}.ts`, context);
    }
  }
}

/** Loads copied Home Assistant TypeScript modules as their JavaScript source. */
export async function load(url, context, nextLoad) {
  if (!url.endsWith('.ts')) return nextLoad(url, context);

  const source = await readFile(new URL(url), 'utf8');
  return {
    format: 'module',
    shortCircuit: true,
    source: ts.transpileModule(source, {
      compilerOptions: {
        module: ts.ModuleKind.ESNext,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText,
  };
}
