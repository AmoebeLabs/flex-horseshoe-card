import ColorStops from './color-stops.js';
import Merge from './merge.js';

/** Owns runtime entity configuration and derived fhs_sparkline states. */
export default class CardEntities {
  constructor(templates, cardTheme) {
    this.templates = templates;
    this.cardTheme = cardTheme;
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
      let matchedType;
      sparklineConfigs.forEach((sparklineConfig) => {
        sparklineEntityTypes.forEach((entityType) => {
          if (entityConfig.entity === `fhs_sparkline.${sparklineConfig.id}_${entityType}`) {
            matchedSparkline = sparklineConfig;
            matchedType = entityType;
          }
        });
      });
      if (!matchedSparkline) throw new Error(`[entities] Unknown sparkline entity: ${entityConfig.entity}`);

      const localEntityConfig = {
        ...resolvedEntityConfigs[matchedSparkline.entity_index],
        ...entityConfig,
        local: true,
        source_entity_index: matchedSparkline.entity_index,
        sparkline_id: matchedSparkline.id,
        sparkline_entity_type: matchedType,
      };
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

  /** Rebuilds local sparkline entities from current graph statistics. */
  updateSparklineEntities(resolvedEntityConfigs, entities, sparklineGraphTools) {
    resolvedEntityConfigs.forEach((entityConfig, entityIndex) => {
      if (!entityConfig.sparkline_entity_type) return;
      const graph = sparklineGraphTools.find((tool) => tool.config.id === entityConfig.sparkline_id);
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
        state = Object.hasOwn(graph.stats, entityType) ? graph.stats[entityType] : 'unavailable';
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
        const historical = graph.config.period.type !== 'real_time';
        if (historical && graph.historyDurationReady) {
          const hours = graph.config.period[graph.config.period.type].duration.hour;
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
        const binned = graph.config.period.type !== 'real_time' && graph.config.sparkline.show.chart_type !== 'state_bands';
        if (binned && graph.historyDurationReady) {
          const hours = 1 / graph.calculateBinsPerHour(graph.config);
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
        const binned = graph.config.period.type !== 'real_time' && graph.config.sparkline.show.chart_type !== 'state_bands';
        state = binned && graph.historyDurationReady ? graph.config.sparkline.state_values.aggregate_func : 'unavailable';
        unitOfMeasurement = undefined;
        deviceClass = undefined;
      }

      entities[entityIndex] = Merge.mergeDeep(sourceEntity, {
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
        },
      });
    });
  }
}
