import { DEFAULT_DOMAIN_ICON_NAME } from '../const_name';
import { computeDomain } from './compute_domain';
import { domainIconName } from './domain_icon_name';

// eslint-disable-next-line import/prefer-default-export
export const stateIconName = (state) => {
  if (!state) {
    return DEFAULT_DOMAIN_ICON_NAME;
  }
  return domainIconName(computeDomain(state.entity_id), state);
};
