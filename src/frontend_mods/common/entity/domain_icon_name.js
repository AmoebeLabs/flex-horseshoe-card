// import { weatherIcon } from '../../data/weather';
/**
 * Return the icon to be used for a domain.
 *
 * Optionally pass in a state to influence the domain icon.
 */
import { DEFAULT_DOMAIN_ICON_NAME, FIXED_DOMAIN_ICONS_NAME } from '../const_name';
import { alarmPanelIconName } from './alarm_panel_icon_name';
import { binarySensorIconName } from './binary_sensor_icon_name';
import { coverIconName } from './cover_icon_name';
import { numberIconName } from './number_icon_name';
import { sensorIconName } from './sensor_icon_name';

export const domainIconName = (domain, stateObj, state) => {
  // eslint-disable-next-line no-use-before-define
  const icon = domainIconWithoutDefaultName(domain, stateObj, state);
  if (icon) {
    return icon;
  }
  // eslint-disable-next-line
  console.warn(`Unable to find icon for domain ${domain}`)
  return DEFAULT_DOMAIN_ICON_NAME;
};

export const domainIconWithoutDefaultName = (domain, stateObj, state) => {
  const compareState = state !== undefined ? state : stateObj?.state;

  // eslint-disable-next-line default-case
  switch (domain) {
    case 'alarm_control_panel':
      return alarmPanelIconName(compareState);

    case 'automation':
      return compareState === 'off' ? 'mdi:robot-off' : 'mdi:robot';

    case 'binary_sensor':
      return binarySensorIconName(compareState, stateObj);

    case 'button':
      switch (stateObj?.attributes.device_class) {
        case 'restart':
          return 'mdi:restart';
        case 'update':
          return 'mdi:package-up';
        default:
          return 'mdi:gesture-tap-button';
      }

    case 'camera':
      return compareState === 'off' ? 'mdi:video-off' : 'mdi:video';

    case 'cover':
      return coverIconName(compareState, stateObj);

    case 'device_tracker':
      if (stateObj?.attributes.source_type === 'router') {
        return compareState === 'home' ? 'mdi:lan-connect' : 'mdi:lan-cisconnect';
      }
      if (
        ['bluetooth', 'bluetooth_le'].includes(stateObj?.attributes.source_type)
      ) {
        return compareState === 'home' ? 'mdi:bluetooth-connect' : 'mdi:bluetooth';
      }
      return compareState === 'not_home' ? 'mdi:account-arrow-right' : 'mdi:account';

    case 'fan':
      return compareState === 'off' ? 'mdi:fan-off' : 'mdi:fan';

    case 'humidifier':
      return compareState === 'off' ? 'mdi:air-humidifier-off' : 'mdi:air-humidifier';

    case 'input_boolean':
      return compareState === 'on'
        ? 'mdi:check-circle-outline'
        : 'mdi:close-circle-outline';

    case 'input_datetime':
      if (!stateObj?.attributes.has_date) {
        return 'mdi:clock';
      }
      if (!stateObj.attributes.has_time) {
        return 'mdi:calendar';
      }
      break;

    case 'lock':
      switch (compareState) {
        case 'unlocked':
          return 'mdi:lock-open';
        case 'jammed':
          return 'mdi:lock-alert';
        case 'locking':
        case 'unlocking':
          return 'mdi:lock-clock';
        default:
          return 'mdi:lock';
      }

    case 'media_player':
      switch (stateObj?.attributes.device_class) {
        case 'speaker':
          switch (compareState) {
            case 'playing':
              return 'mdi:speaker-play';
            case 'paused':
              return 'mdi:speaker-pause';
            case 'off':
              return 'mdi:speaker-off';
            default:
              return 'mdi:speaker';
          }
        case 'tv':
          switch (compareState) {
            case 'playing':
              return 'mdi:television-play';
            case 'paused':
              return 'mdi:television-pause';
            case 'off':
              return 'mdi:television-off';
            default:
              return 'mdi:television';
          }
        case 'receiver':
          switch (compareState) {
            case 'off':
              return 'mdi:audio-video-off';
            default:
              return 'mdi:audio-video';
          }
        default:
          switch (compareState) {
            case 'playing':
            case 'paused':
              return 'mdi:cast-connected';
            case 'off':
              return 'mdi:cast-off';
            default:
              return 'mdi:cast';
          }
      }

    case 'number': {
      const icon = numberIconName(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case 'person':
      return compareState === 'not_home' ? 'mdi:account-arrow-right' : 'mdi:account';

    case 'switch':
      switch (stateObj?.attributes.device_class) {
        case 'outlet':
          return compareState === 'on' ? 'mdi:power-plug' : 'mdi:power-plug-off';
        case 'switch':
          return compareState === 'on'
            ? 'mdi:toggle-switch-variant'
            : 'mdi:toggle-switch-variant-off';
        default:
          return 'mdi:toggle-switch-variant';
      }

    case 'sensor': {
      const icon = sensorIconName(stateObj);
      if (icon) {
        return icon;
      }

      break;
    }

    case 'sun':
      return stateObj?.state === 'above_horizon'
        ? 'mdi:white-balance-sunny'
        : 'mdi:weather-night';

    case 'switch_as_x':
      return 'mdi:swap-horizontal';

    case 'threshold':
      return 'mdi:chart-sankey';

    // case 'update':
    //   return compareState === 'on'
    //     ? updateIsInstalling(stateObj)
    //       ? 'mdi:PackageDown
    //       : 'mdi:PackageUp
    //     : 'mdi:Package;

    case 'water_heater':
      return compareState === 'off' ? 'mdi:water-boiler-off' : 'mdi:water-boiler';

    // case 'weather':
    //   return weatherIcon(stateObj?.state);
  }

  if (domain in FIXED_DOMAIN_ICONS_NAME) {
    return FIXED_DOMAIN_ICONS_NAME[domain];
  }

  return undefined;
};
