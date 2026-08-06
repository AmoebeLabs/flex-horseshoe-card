/** Return an icon representing a alarm panel state. */

// eslint-disable-next-line import/prefer-default-export
export const alarmPanelIconName = (state) => {
  switch (state) {
    case 'armed_away':
      return 'mdi:shield-lock';
    case 'armed_vacation':
      return 'mdi:shield-airplane';
    case 'armed_home':
      return 'mdi:shield-home';
    case 'armed_night':
      return 'mdi:shield-moon';
    case 'armed_custom_bypass':
      return 'mdi:security';
    case 'pending':
      return 'mdi:shield-outline';
    case 'triggered':
      return 'mdi:bell-ring';
    case 'disarmed':
      return 'mdi:shield-off';
    default:
      return 'mdi:shield';
  }
};
