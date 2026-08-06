import memoizeOne from 'memoize-one';
// import { TimeFormat } from '../../data/translation';

var TimeFormat;
// eslint-disable-next-line func-names, @stylistic/wrap-iife
(function (TimeFormat) {
  TimeFormat.language = 'language';
  TimeFormat.system = 'system';
  TimeFormat.am_pm = '12';
  TimeFormat.twenty_four = '24';
})((TimeFormat = TimeFormat || (TimeFormat = {})));

// eslint-disable-next-line import-x/prefer-default-export
export const useAmPm = memoizeOne((locale) => {
  if (locale.time_format === TimeFormat.language || locale.time_format === TimeFormat.system) {
    const testLanguage = locale.time_format === TimeFormat.language ? locale.language : undefined;
    const test = new Date().toLocaleString(testLanguage);
    return test.includes('AM') || test.includes('PM');
  }

  return locale.time_format === TimeFormat.am_pm;
});
