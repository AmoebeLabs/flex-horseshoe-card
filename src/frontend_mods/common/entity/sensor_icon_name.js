/** Return an icon representing a sensor state. */
import {
 SENSOR_DEVICE_CLASS_BATTERY, UNIT_C, UNIT_F,
} from '../const';
import { batteryStateIconName } from './battery_icon_name';
import { FIXED_DEVICE_CLASS_ICONS_NAME } from '../const_name';
// eslint-disable-next-line import/prefer-default-export
export const sensorIconName = (stateObj) => {
  const dclass = stateObj?.attributes.device_class;

  // Temp
  // console.log('sensorIconName', stateObj);

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS_NAME) {
    return FIXED_DEVICE_CLASS_ICONS_NAME[dclass];
  }

  if (dclass === SENSOR_DEVICE_CLASS_BATTERY) {
    return stateObj ? batteryStateIconName(stateObj) : 'mdi:battery';
  }

  const unit = stateObj?.attributes.unit_of_measurement;
  if (unit === UNIT_C || unit === UNIT_F) {
    return 'mdi-thermometer';
  }

  return undefined;
};
