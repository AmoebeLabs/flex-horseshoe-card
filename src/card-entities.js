import ColorStops from './color-stops.js';
import Merge from './merge.js';
import Colors from './colors.js';

/** Owns runtime entity configuration and derived fhs_sparkline states. */
export default class CardEntities {
  /**
   * Stores the shared template and theme domains used while resolved entity
   * configuration is rebuilt for each Home Assistant update.
   */
  constructor(templates, cardTheme) {
    this.templates = templates;
    this.cardTheme = cardTheme;
    this.stateChanged = false;
  }

  /**
   * Selects the complete color-stop entry for an item current entity value.
   * Numeric stops use range logic; state stops use exact string matching.
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

    const color = Colors.calculateStrokeColor(stateNumber, colorStops, item.show.item_style === 'colorstopinterpolated');
    const selectedStop = stateNumber <= colorStops.colors[0].value
      ? colorStops.colors[0]
      : colorStops.colors.find((stop, index) => {
          const nextStop = colorStops.colors[index + 1];
          return nextStop === undefined || stateNumber < nextStop.value;
        });

    return selectedStop ? { ...selectedStop, color } : undefined;
  }

  /** Returns only the resolved color for existing renderers and callers. */
  getItemColorFromStops(item, colorStops, config, entities) {
    return this.getItemColorStop(item, colorStops, config, entities)?.color;
  }

  /** Evaluates entity templates and links local sparkline entities to graphs. */
  buildRuntimeEntityConfigs(config, evaluateJavascript) {
    if (config.dev.debug) console.log('resolving entity config for', config.entities);
    const resolvedEntityConfigs = config.entities.map((entityConfig, index) => {
      const item = { entity_index: index };
      const resolvedEntityConfig = evaluateJavascript && this.templates.hasJavascriptTemplates(entityConfig)
        ? this.templates.getJsTemplateOrValue(item, entityConfig)
        : entityConfig;
      if (resolvedEntityConfig.color_stops) {
        resolvedEntityConfig.colorstops = ColorStops.normalize(resolvedEntityConfig.color_stops, this.cardTheme.getActiveColorStopMode());
      }
      return resolvedEntityConfig;
    });
    const sparklineEntityTypes = ['min_time', 'max_time', 'bin_duration', 'aggregate_func', 'duration', 'min', 'avg', 'max'];
    const sparklineConfigs = config.layout.sparklines ?? [];

    return resolvedEntityConfigs.map((entityConfig) => {
      if (!entityConfig.entity.startsWith('fhs_sparkline.')) return entityConfig;
      let matchedSparkline;
      let matchedSeries;
      let matchedType;

      // Derived IDs are matched from the declared configuration instead of
      // splitting underscores, so series IDs may contain underscores safely.
      sparklineConfigs.forEach((sparklineConfig) => {
        sparklineEntityTypes.forEach((entityType) => {
          if (entityConfig.entity === `fhs_sparkline.${sparklineConfig.id}_${entityType}`) {
            matchedSparkline = sparklineConfig;
            matchedType = entityType;
          }
        });

        if (sparklineConfig.series !== undefined) {
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

      // The unqualified graph alias describes its primary series, including
      // explicit collections whose source is declared on the first series.
      const sourceEntityIndex = matchedSeries !== undefined
        ? matchedSeries.entity_index
        : (matchedSparkline.series !== undefined ? matchedSparkline.series[0].entity_index : (matchedSparkline.entity_index ?? 0));
      const localEntityConfig = {
        ...resolvedEntityConfigs[sourceEntityIndex],
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
  }

  /**
   * Publishes changed local Sparkline values and their source metadata into
   * the shared array. Equal results retain the entity object consumers know.
   *
   * @returns {Array<number>} Indexes whose published entity content changed.
   */
  updateSparklineEntities(resolvedEntityConfigs, entities, sparklineGraphTools) {
    const changedEntityIndexes = [];
    resolvedEntityConfigs.forEach((entityConfig, entityIndex) => {
      if (!entityConfig.sparkline_entity_type) return;
      // A completion supplies only its affected graph. Other graphs retain
      // their published outputs until their own source/result changes.
      if (!sparklineGraphTools.some((tool) => tool.config.id === entityConfig.sparkline_id)) return;
      const graphTool = sparklineGraphTools.find((tool) => tool.config.id === entityConfig.sparkline_id);
      const sparklineResult = graphTool.getSeriesResult(entityConfig.sparkline_series_id);
      const sourceEntity = entities[entityConfig.source_entity_index];
      const sourceConfig = resolvedEntityConfigs[entityConfig.source_entity_index];
      const entityType = entityConfig.sparkline_entity_type;
      const labelMap = {
        min: 'min', avg: 'mean', max: 'max', min_time: 'min', max_time: 'max',
        duration: 'Duration', bin_duration: 'Bin duration', aggregate_func: 'Aggregate function',
      };
      let state;
      let unitOfMeasurement = sourceEntity.attributes.unit_of_measurement;
      let deviceClass = sourceEntity.attributes.device_class;

      if (['min', 'avg', 'max', 'min_time', 'max_time'].includes(entityType)) {
        state = sparklineResult[entityType] === undefined ? 'unavailable' : sparklineResult[entityType];
        if (entityType === 'avg' && Number.isFinite(Number(state))) {
          const sourceDecimals = sourceConfig.decimals !== undefined
            ? Number(sourceConfig.decimals)
            : Number(String(sourceEntity.state).includes('.') ? String(sourceEntity.state).split('.')[1].length : 0);
          state = Number(state).toFixed(sourceDecimals);
        }
        if (entityType === 'min_time' || entityType === 'max_time') {
          unitOfMeasurement = undefined;
          deviceClass = undefined;
        }
      }

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
        state = sparklineResult.aggregate_func === undefined ? 'unavailable' : sparklineResult.aggregate_func;
        unitOfMeasurement = undefined;
        deviceClass = undefined;
      }

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
      // HA states and copied attributes are JSON data, just like the active
      // configuration signatures. Include timestamps and metadata in equality.
      if (JSON.stringify(entities[entityIndex]) !== JSON.stringify(nextEntity)) {
        entities[entityIndex] = nextEntity;
        changedEntityIndexes.push(entityIndex);
      }
    });
    this.stateChanged = changedEntityIndexes.length > 0;
    return changedEntityIndexes;
  }

  /** Marks the current local sparkline entity states as consumed by the card update. */
  markStateHandled() {
    this.stateChanged = false;
  }
}
