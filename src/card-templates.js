import Merge from './merge.js';
import Utils from './utils.js';

/**
 * Compiles root-level FHS templates into normal card configuration.
 *
 * A template is only config for the current card. The template catalog lives on
 * the Lovelace/dashboard config so templates are reusable by multiple cards.
 */
export default class CardTemplates {
  /**
   * Applies the configured root template to the current card config.
   *
   * The card config wins over the template config. Template variables replace
   * [[name]] placeholders inside the selected template body before the normal
   * FHS config pipeline continues.
   *
   * @param {object} config - Card config that may contain `template`.
   * @param {object} card - FHS card instance used to access Lovelace templates.
   * @returns {object} The same config object after template compilation.
   */
  static compile(config, card) {
    delete config.fhs_templates;

    card.lovelace = card.lovelace || Utils.getLovelace();

    if (config.template !== undefined) {
      const compiledConfig = CardTemplates.compileTemplateUse(config, card);

      if (compiledConfig.dev?.debug || config.dev?.debug) {
        console.log('[FHS templates] compiled root template', {
          template: config.template,
          compiledConfig,
        });
      }

      // Replace the input config in-place so setConfig can continue with the normal pipeline.
      Object.keys(config).forEach((key) => delete config[key]);
      Object.entries(compiledConfig).forEach(([key, value]) => {
        config[key] = value;
      });
    }

    const compiledTemplateParts = CardTemplates.compileTemplateParts(config, card);

    Object.keys(config).forEach((key) => delete config[key]);
    Object.entries(compiledTemplateParts).forEach(([key, value]) => {
      config[key] = value;
    });

    return config;
  }

  /**
   * Compiles one object that contains a `template:` key.
   *
   * The template type selects the body property from the template catalog. A
   * `type: color_stops` template returns `color_stops:`, a `type: state_map`
   * template returns `state_map:`, and a `type: card` template returns `card:`.
   * The local object is then merged over that body so keys like `id` can still
   * be overridden at the place where the template is used.
   *
   * @param {object} configPart - Config object containing `template`.
   * @param {object} card - FHS card instance used to access Lovelace templates.
   * @returns {object} Config object with the template body applied.
   */
  static compileTemplateUse(configPart, card) {
    const templateName = typeof configPart.template === 'string' ? configPart.template : configPart.template.name;
    const templateVariables = typeof configPart.template === 'string' ? undefined : configPart.template.variables;
    const template = CardTemplates.getTemplate(card, templateName);
    const templateConfig = CardTemplates.replaceVariables(templateVariables, template);
    const localConfig = Merge.mergeDeep({}, configPart);

    delete localConfig.template;

    return CardTemplates.mergeTemplateConfig(templateConfig, localConfig);
  }

  /**
   * Compiles nested template uses inside the current FHS config.
   *
   * This runs before ref(), calc() and same_as, so a template can still contain
   * normal FHS config syntax. The `cards[]` section is skipped deliberately: a
   * child card is a normal Lovelace card and must keep its own template key for
   * its own implementation.
   *
   * @param {object|Array} configPart - Current config object or list.
   * @param {object} card - FHS card instance used to access Lovelace templates.
   * @returns {object|Array} The same config structure with nested templates compiled.
   */
  static compileTemplateParts(configPart, card) {
    if (Array.isArray(configPart)) {
      return configPart.map((item) => CardTemplates.compileTemplateParts(item, card));
    }

    if (configPart && typeof configPart === 'object') {
      if (configPart.template !== undefined) {
        const compiledConfigPart = CardTemplates.compileTemplateUse(configPart, card);

        return CardTemplates.compileTemplateParts(compiledConfigPart, card);
      }

      const compiledConfigPart = {};

      Object.entries(configPart).forEach(([key, value]) => {
        compiledConfigPart[key] = key === 'cards' ? value : CardTemplates.compileTemplateParts(value, card);
      });

      return compiledConfigPart;
    }

    return configPart;
  }

  /**
   * Finds a template by name in Lovelace dashboard and view config.
   *
   * Home Assistant keeps custom YAML keys differently between config and rawConfig.
   * This scans both objects and their views so a view-level include works the same
   * as a dashboard-level include.
   *
   * @param {object} card - FHS card instance with a Lovelace reference.
   * @param {string} templateName - Template name requested by the card config.
   * @returns {object} Template catalog entry.
   */
  static getTemplate(card, templateName) {
    const lovelaceConfigs = [card.lovelace.config, card.lovelace.rawConfig];
    let template;

    lovelaceConfigs.forEach((lovelaceConfig) => {
      if (template) return;

      template = lovelaceConfig.fhs_templates?.templates?.[templateName];

      if (template) return;

      lovelaceConfig.views.forEach((view) => {
        if (template) return;

        template = view.fhs_templates?.templates?.[templateName];
      });
    });

    if (!template) {
      throw new Error(`FHS template '${templateName}' not found`);
    }

    return template;
  }

  /**
   * Replaces [[variable]] placeholders in a template body.
   *
   * The template metadata tells which property contains the actual body. For an
   * FHS card template that is normally `template.type: card`, so the body is the
   * `card:` object. Defaults are appended after supplied variables, matching the
   * existing SAK template behavior.
   *
   * @param {Array<object>} variables - Variables supplied by the card template use.
   * @param {object} template - Template catalog entry.
   * @returns {object} Template body with placeholders replaced.
   */
  static replaceVariables(variables, template) {
    if (!variables && !template.template.defaults) {
      return Merge.mergeDeep({}, template[template.template.type]);
    }

    let variableArray = variables?.slice(0) ?? [];

    if (template.template.defaults) {
      variableArray = variableArray.concat(template.template.defaults);
    }

    let jsonConfig = JSON.stringify(template[template.template.type]);

    variableArray.forEach((variable) => {
      const key = Object.keys(variable)[0];
      const value = Object.values(variable)[0];

      if (typeof value === 'number' || typeof value === 'boolean') {
        const rxp = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        jsonConfig = jsonConfig.replace(rxp, value);
      }

      if (typeof value === 'object') {
        const rxp = new RegExp(`"\\[\\[${key}\\]\\]"`, 'gm');
        const valueString = JSON.stringify(value);
        jsonConfig = jsonConfig.replace(rxp, valueString);
      } else {
        const rxp = new RegExp(`\\[\\[${key}\\]\\]`, 'gm');
        jsonConfig = jsonConfig.replace(rxp, value);
      }
    });

    return JSON.parse(jsonConfig);
  }

  /**
   * Merges one template config with one card config.
   *
   * Objects are merged deeply. Arrays from the card replace template arrays,
   * because a root card override should be explicit and predictable.
   *
   * @param {object} templateConfig - Template card config.
   * @param {object} cardConfig - User card config.
   * @returns {object} Complete card config.
   */
  static mergeTemplateConfig(templateConfig, cardConfig) {
    const mergedConfig = Merge.mergeDeep({}, templateConfig);

    Object.entries(cardConfig).forEach(([key, value]) => {
      if (Array.isArray(value)) {
        // mergeDeep() always starts from an object internally, so using it with
        // an array as the root would turn entities[] into {0: ...}. Keep the
        // root as an array and clone only object items inside it.
        mergedConfig[key] = value.map((item) => (item && typeof item === 'object' ? Merge.mergeDeep(Array.isArray(item) ? [] : {}, item) : item));
        return;
      }

      if (value && typeof value === 'object') {
        mergedConfig[key] = CardTemplates.mergeTemplateConfig(mergedConfig[key] ?? {}, value);
        return;
      }

      mergedConfig[key] = value;
    });

    return mergedConfig;
  }
}
