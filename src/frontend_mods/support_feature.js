// eslint-disable-next-line no-use-before-define
export const supportsFeature = (stateObj, feature) => supportsFeatureFromAttributes(stateObj.attributes, feature);

export const supportsFeatureFromAttributes = (
  attributes,
  feature, // eslint-disable-next-line no-bitwise
) => (attributes.supported_features & feature) !== 0;
