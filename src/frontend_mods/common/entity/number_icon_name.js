import { FIXED_DEVICE_CLASS_ICONS_NAME } from '../const_name';

// eslint-disable-next-line import/prefer-default-export
export const numberIconName = (stateObj) => {
  const dclass = stateObj?.attributes.device_class;

  if (dclass && dclass in FIXED_DEVICE_CLASS_ICONS_NAME) {
    return FIXED_DEVICE_CLASS_ICONS_NAME[dclass];
  }

  return undefined;
};
