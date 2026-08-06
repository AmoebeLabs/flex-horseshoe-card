/* eslint-disable no-use-before-define */
import memoizeOne from 'memoize-one';
// import '../../resources/intl-polyfill';
import { useAmPm } from './use_am_pm';

// August 9, 2021, 8:23 AM
export const formatDateTime = (dateObj, locale) => formatDateTimeMem(locale).format(dateObj);

const formatDateTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Aug 9, 2021, 8:23 AM
export const formatShortDateTimeWithYear = (dateObj, locale) => formatShortDateTimeWithYearMem(locale).format(dateObj);

const formatShortDateTimeWithYearMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// Aug 9, 8:23 AM
export const formatShortDateTime = (dateObj, locale) => formatShortDateTimeMem(locale).format(dateObj);

const formatShortDateTimeMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        month: 'short',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// August 9, 2021, 8:23:15 AM
export const formatDateTimeWithSeconds = (dateObj, locale) => formatDateTimeWithSecondsMem(locale).format(dateObj);

const formatDateTimeWithSecondsMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: useAmPm(locale) ? 'numeric' : '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);

// 9/8/2021, 8:23 AM
export const formatDateTimeNumeric = (dateObj, locale) => formatDateTimeNumericMem(locale).format(dateObj);

const formatDateTimeNumericMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(
      locale.language === 'en' && !useAmPm(locale)
        ? 'en-u-hc-h23'
        : locale.language,
      {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: useAmPm(locale),
      },
    ),
);
