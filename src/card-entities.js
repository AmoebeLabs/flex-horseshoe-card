import ColorStops from './color-stops.js';
import Merge from './merge.js';
import Colors from './colors.js';
import Templates from './templates.js';

/**
 * Builds runtime entity configs for FHS tools and updates configured
 * `fhs_sparkline.*` entries from Sparkline results.
 */
export default class CardEntities {

  /**
   * Stores the card's template evaluator and HA theme color context.
   *
   * @param {Templates} templates - Evaluates JavaScript in configured entities.
   * @param {object} cardTheme - Supplies the active color-stop mode and CSS color context.
   */
  constructor(templates, cardTheme) {
    this.templates = templates;
    this.cardTheme = cardTheme;
    this.paint = { colorStops: [] };
  }

  /**
   * Finds a color stop from this FHS item's configured entity value.
   * Uses its configured attribute when present, otherwise its HA state; state
   * stops match as text and numeric stops use the configured numeric range.
   *
   * @param {object} item - FHS layout item with an entity index and display style.
   * @param {object|undefined} colorStops - Normalized color stops for the item.
   * @param {object} config - Current FHS card config.
   * @param {Array<object>} entities - Current HA and card-local entity values.
   * @returns {object|undefined} Matching state stop or numeric stop with its selected color.
   */
  getItemColorStop(item, colorStops, config, entities) {
    if (!colorStops) return undefined;
    const entityIndex = item.entity_index;
    if (entityIndex === undefined || entityIndex === null) return undefined;

    const entity = entities[entityIndex];
    if (!entity) return undefined;
    const entityConfig = config.entities[entityIndex];
    const attribute = entityConfig.attribute;
    const rawState = attribute && entity.attributes[attribute] !== undefined
      ? entity.attributes[attribute]
      : entity.state;
    const stateStops = colorStops.colors.filter((stop) => stop.state !== undefined);

    if (stateStops.length) {
      return stateStops.find((stop) => String(stop.state) === String(rawState));
    }

    const stateNumber = Number(rawState);
    if (!Number.isFinite(stateNumber)) return undefined;

    const color = Colors.calculateStrokeColor(stateNumber, colorStops, item.show.item_style === 'colorstopinterpolated', this.cardTheme.colorContext);
    const selectedStop = stateNumber <= colorStops.colors[0].value
      ? colorStops.colors[0]
      : colorStops.colors.find((stop, index) => {
          const nextStop = colorStops.colors[index + 1];
          return nextStop === undefined || stateNumber < nextStop.value;
        });

    return selectedStop ? { ...selectedStop, color } : undefined;
  }

  /** Returns the color selected for this FHS item's current entity value. */
  getItemColorFromStops(item, colorStops, config, entities) {
    return this.getItemColorStop(item, colorStops, config, entities)?.color;
  }

  /**
   * Evaluates configured entity templates and links `fhs_sparkline.*` entries
   * to the HA entity and Series used for their Sparkline result.
   *
   * When `series` is JavaScript, use the Sparkline tool's evaluated Series list
   * when available so the same expression is not evaluated twice.
   *
   * @param {object} config - FHS card config containing entity and Sparkline layouts.
   * @param {boolean} evaluateJavascript - Whether to evaluate configured JavaScript templates.
   * @param {Array<object>} sparklineGraphTools - Sparkline tools with their current evaluated Series config.
   * @returns {Array<object>} Runtime entity configs in `config.entities` order.
   */
  buildRuntimeEntityConfigs(config, evaluateJavascript, sparklineGraphTools = []) {
    if (config.dev.debug) console.log('resolving entity config for', config.entities);
    const evaluatedEntityConfigs = config.entities.map((entityConfig, index) => {
      const item = { entity_index: index };
      return evaluateJavascript && this.templates.hasJavascriptTemplates(entityConfig)
        ? this.templates.getJsTemplateOrValue(item, entityConfig)
        : entityConfig;
    });
    const sourceColorStops = evaluatedEntityConfigs.map((entityConfig) => {
      if (entityConfig.color_stops === undefined) return undefined;
      return ColorStops.normalize(entityConfig.color_stops, this.cardTheme.getActiveColorStopMode());
    });
    // Check `bin_duration` before `duration` so the longer result name stays intact.
    const sparklineEntityTypes = ['min_time', 'max_time', 'bin_duration', 'aggregate_func', 'duration', 'min', 'avg', 'max'];
    const sparklineConfigs = (config.layout.sparklines ?? []).map((sparklineConfig) => {
      if (!Templates.isJsTemplate(sparklineConfig.series)) return sparklineConfig;
      // The Sparkline tool evaluates whole-Series JavaScript in its item context.
      // Reuse that Series list instead of evaluating the expression again here.
      const graphTool = sparklineGraphTools.find((tool) => tool.config.id === sparklineConfig.id);
      return graphTool === undefined ? sparklineConfig : graphTool.config;
    });

    const runtimeEntityConfigs = evaluatedEntityConfigs.map((entityConfig) => {
      if (!entityConfig.entity.startsWith('fhs_sparkline.')) return entityConfig;
      let matchedSparkline;
      let matchedSeries;
      let matchedType;

      sparklineConfigs.forEach((sparklineConfig) => {
        sparklineEntityTypes.forEach((entityType) => {
          if (entityConfig.entity === `fhs_sparkline.${sparklineConfig.id}_${entityType}`) {
            matchedSparkline = sparklineConfig;
            matchedType = entityType;
          }
        });

        if (Templates.isJsTemplate(sparklineConfig.series)) {
          // Before the Series list is available, use a known result suffix to
          // read the named Series ID from the local entity ID.
          // updateSparklineEntities() adds the selected Series' HA config once
          // SparklineGraphTool has evaluated the whole `series` template.
          const prefix = `fhs_sparkline.${sparklineConfig.id}_`;
          const entityType = matchedSparkline === sparklineConfig ? undefined : sparklineEntityTypes.find((type) => (
            entityConfig.entity.startsWith(prefix) && entityConfig.entity.endsWith(`_${type}`) && entityConfig.entity.length > prefix.length + type.length + 1
          ));
          if (entityType !== undefined) {
            matchedSparkline = sparklineConfig;
            matchedSeries = { id: entityConfig.entity.slice(prefix.length, -entityType.length - 1), entity_index: sparklineConfig.entity_index ?? 0 };
            matchedType = entityType;
          }
        } else if (sparklineConfig.series !== undefined) {
          // Compare the complete configured ID instead of splitting at `_`;
          // Series IDs may contain underscores or text such as `_bin`.
          sparklineConfig.series.forEach((seriesConfig) => {
            sparklineEntityTypes.forEach((entityType) => {
              if (entityConfig.entity === `fhs_sparkline.${sparklineConfig.id}_${seriesConfig.id}_${entityType}`) {
                matchedSparkline = sparklineConfig;
                matchedSeries = seriesConfig;
                matchedType = entityType;
              }
            });
          });
        }
      });
      if (!matchedSparkline) throw new Error(`[entities] Unknown sparkline entity: ${entityConfig.entity}`);

      // A named result uses its Series entity; an unqualified result uses the
      // first Series entity, or the Sparkline layout entity when no list exists.
      const sourceEntityIndex = matchedSeries !== undefined
        ? matchedSeries.entity_index
        : (matchedSparkline.series !== undefined && !Templates.isJsTemplate(matchedSparkline.series) ? matchedSparkline.series[0].entity_index : (matchedSparkline.entity_index ?? 0));
      const localEntityConfig = {
        ...(Templates.isJsTemplate(matchedSparkline.series) ? {} : evaluatedEntityConfigs[sourceEntityIndex]),
        ...entityConfig,
        local: true,
        source_entity_index: sourceEntityIndex,
        sparkline_id: matchedSparkline.id,
        sparkline_entity_type: matchedType,
      };
      if (matchedSeries !== undefined) localEntityConfig.sparkline_series_id = matchedSeries.id;
      delete localEntityConfig.attribute;
      if (entityConfig.name === undefined) delete localEntityConfig.name;
      if (matchedType === 'min_time' || matchedType === 'max_time') {
        localEntityConfig.format = entityConfig.format ?? 'datetime-short';
        localEntityConfig.unit = entityConfig.unit ?? '';
      }
      if ((matchedType === 'duration' || matchedType === 'bin_duration') && entityConfig.unit === undefined) delete localEntityConfig.unit;
      if (matchedType === 'aggregate_func') localEntityConfig.unit = entityConfig.unit ?? '';
      return localEntityConfig;
    });

    // Local Sparkline entities use their source entity's color stops unless
    // their own config supplies a color-stop list.
    this.paint.colorStops = runtimeEntityConfigs.map((entityConfig, entityIndex) => {
      if (evaluatedEntityConfigs[entityIndex].color_stops !== undefined) return sourceColorStops[entityIndex];
      if (entityConfig.source_entity_index !== undefined) return sourceColorStops[entityConfig.source_entity_index];
      return undefined;
    });

    return runtimeEntityConfigs;
  }

  /**
   * Updates local `fhs_sparkline.*` entities from the current Sparkline results.
   *
   * @param {Array<object>} runtimeEntityConfigs - Current FHS entity configs.
   * @param {Array<object>} entities - Shared HA and card-local entity values.
   * @param {Array<object>} sparklineGraphTools - Sparkline tools with calculated results.
   * @returns {number[]} Entity indexes whose state or HA metadata changed.
   */
  updateSparklineEntities(runtimeEntityConfigs, entities, sparklineGraphTools) {
    const changedEntityIndexes = [];
    runtimeEntityConfigs.forEach((entityConfig, entityIndex) => {
      if (!entityConfig.sparkline_entity_type) return;
      // A History completion may include one Sparkline tool; leave local values
      // for every other Sparkline unchanged until that graph updates.
      if (!sparklineGraphTools.some((tool) => tool.config.id === entityConfig.sparkline_id)) return;
      const graphTool = sparklineGraphTools.find((tool) => tool.config.id === entityConfig.sparkline_id);
      const labelMap = {
        min: 'min', avg: 'mean', max: 'max', min_time: 'min', max_time: 'max',
        duration: 'Duration', bin_duration: 'Bin duration', aggregate_func: 'Aggregate function',
      };
      if (Templates.isJsTemplate(graphTool.sourceConfig.series)) {
        // A JavaScript Series list can change which HA entity backs a named
        // Series. Follow the current list before copying its entity details.
        // Match the full entity ID so underscores and suffix-like text can be
        // part of the configured Series ID.
        let seriesConfig;
        if (entityConfig.sparkline_series_id === undefined) {
          seriesConfig = graphTool.config.series[0];
        } else {
          graphTool.config.series.forEach((entry) => {
            Object.keys(labelMap).forEach((type) => {
              if (entityConfig.entity === `fhs_sparkline.${graphTool.config.id}_${entry.id}_${type}`) {
                seriesConfig = entry;
                entityConfig.sparkline_series_id = entry.id;
                entityConfig.sparkline_entity_type = type;
              }
            });
          });
        }
        if (entityConfig.color_stops === undefined) {
          // Keep the Series palette on this local entity unless it has its own stops.
          this.paint.colorStops[entityIndex] = this.paint.colorStops[seriesConfig.entity_index];
        }
        const { attribute: _attribute, name: _name, ...sourceEntityConfig } = runtimeEntityConfigs[seriesConfig.entity_index];
        entityConfig = { ...sourceEntityConfig, ...entityConfig, source_entity_index: seriesConfig.entity_index };
        runtimeEntityConfigs[entityIndex] = entityConfig;
      }
      const sparklineResult = graphTool.getSeriesResult(entityConfig.sparkline_series_id);
      const sourceEntity = entities[entityConfig.source_entity_index];
      const sourceConfig = runtimeEntityConfigs[entityConfig.source_entity_index];
      const entityType = entityConfig.sparkline_entity_type;
      let state;
      let unitOfMeasurement = sourceEntity.attributes.unit_of_measurement;
      let deviceClass = sourceEntity.attributes.device_class;

      if (['min', 'avg', 'max', 'min_time', 'max_time'].includes(entityType)) {
        state = sparklineResult[entityType] === undefined ? 'unavailable' : sparklineResult[entityType];
        if (entityType === 'avg' && Number.isFinite(Number(state))) {
          // Preserve the source sensor's decimal precision, including trailing zeroes.
          const sourceDecimals = sourceConfig.decimals !== undefined
            ? Number(sourceConfig.decimals)
            : Number(String(sourceEntity.state).includes('.') ? String(sourceEntity.state).split('.')[1].length : 0);
          state = Number(state).toFixed(sourceDecimals);
        }
        if (entityType === 'min_time' || entityType === 'max_time') {
          // Timestamps are not measurements, so they have no sensor unit or device class.
          unitOfMeasurement = undefined;
          deviceClass = undefined;
        }
      }

      // Show Sparkline durations in minutes below an hour, days from 24 hours,
      // and hours between those ranges.
      if (entityType === 'duration') {
        if (sparklineResult.duration !== undefined) {
          const hours = sparklineResult.duration;
          state = String(hours);
          unitOfMeasurement = 'h';
          if (hours < 1) { state = String(hours * 60); unitOfMeasurement = 'min'; }
          if (hours >= 24) { state = String(hours / 24); unitOfMeasurement = 'd'; }
        } else {
          state = 'unavailable';
          unitOfMeasurement = 'h';
        }
        deviceClass = 'duration';
      }

      if (entityType === 'bin_duration') {
        if (sparklineResult.bin_duration !== undefined) {
          const hours = sparklineResult.bin_duration;
          state = String(hours);
          unitOfMeasurement = 'h';
          if (hours < 1) { state = String(hours * 60); unitOfMeasurement = 'min'; }
          if (hours >= 24) { state = String(hours / 24); unitOfMeasurement = 'd'; }
        } else {
          state = 'unavailable';
          unitOfMeasurement = 'h';
        }
        deviceClass = 'duration';
      }

      if (entityType === 'aggregate_func') {
        // The aggregate function is a label, not a measured sensor value.
        state = sparklineResult.aggregate_func === undefined ? 'unavailable' : sparklineResult.aggregate_func;
        unitOfMeasurement = undefined;
        deviceClass = undefined;
      }

      // Start with the source HA entity so its current name, timestamps and
      // other attributes remain available, then add this Sparkline result.
      const nextEntity = Merge.mergeDeep(sourceEntity, {
        entity_id: entityConfig.entity,
        state: String(state),
        label: entityConfig.name === undefined ? labelMap[entityType] : undefined,
        attributes: {
          ...sourceEntity.attributes,
          source_entity_id: ['min', 'avg', 'max'].includes(entityType) ? sourceEntity.entity_id : undefined,
          unit_of_measurement: unitOfMeasurement,
          device_class: deviceClass,
          sparkline_id: entityConfig.sparkline_id,
          sparkline_entity_type: entityType,
          sparkline_series_id: entityConfig.sparkline_series_id,
        },
      });
      // Compare copied HA timestamps and attributes as well as the state, so
      // metadata-only changes reach FHS tools; keep the same object otherwise.
      if (JSON.stringify(entities[entityIndex]) !== JSON.stringify(nextEntity)) {
        entities[entityIndex] = nextEntity;
        changedEntityIndexes.push(entityIndex);
      }
    });
    return changedEntityIndexes;
  }
}
