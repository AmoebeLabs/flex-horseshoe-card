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

    if (config.template === undefined) return config;

    card.lovelace = card.lovelace || Utils.getLovelace();

    const templateName = typeof config.template === 'string' ? config.template : config.template.name;
    const templateVariables = typeof config.template === 'string' ? undefined : config.template.variables;
    const template = CardTemplates.getTemplate(card, templateName);
    const templateConfig = CardTemplates.replaceVariables(templateVariables, template);
    const cardConfig = { ...config };

    delete cardConfig.template;

    const compiledConfig = CardTemplates.mergeTemplateConfig(templateConfig, cardConfig);

    if (compiledConfig.dev?.debug || cardConfig.dev?.debug) {
      console.log('[FHC templates] compiled root template', {
        templateName,
        template,
        templateConfig,
        cardConfig,
        compiledConfig,
      });
    }

    // Replace the input config in-place so setConfig can continue with the normal pipeline.
    Object.keys(config).forEach((key) => delete config[key]);
    Object.entries(compiledConfig).forEach(([key, value]) => {
      config[key] = value;
    });

    return config;
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
      return template[template.template.type];
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
        mergedConfig[key] = Merge.mergeDeep([], value);
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
