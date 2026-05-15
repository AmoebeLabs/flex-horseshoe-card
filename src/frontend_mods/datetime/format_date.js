/* eslint-disable no-use-before-define */
import memoizeOne from 'memoize-one';

// import '../../resources/intl-polyfill';

// Tuesday, August 10
export const formatDateWeekdayDay = (dateObj, locale) => formatDateWeekdayDayMem(locale).format(dateObj);

const formatDateWeekdayDayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
    }),
);

// August 10, 2021
export const formatDate = (dateObj, locale) => formatDateMem(locale).format(dateObj);

const formatDateMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
);

// 10/08/2021
export const formatDateNumeric = (dateObj, locale) => formatDateNumericMem(locale).format(dateObj);

const formatDateNumericMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }),
);

// Aug 10
export const formatDateShort = (dateObj, locale) => formatDateShortMem(locale).format(dateObj);

const formatDateShortMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      day: 'numeric',
      month: 'short',
    }),
);

// August 2021
export const formatDateMonthYear = (dateObj, locale) => formatDateMonthYearMem(locale).format(dateObj);

const formatDateMonthYearMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      month: 'long',
      year: 'numeric',
    }),
);

// August
export const formatDateMonth = (dateObj, locale) => formatDateMonthMem(locale).format(dateObj);

const formatDateMonthMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      month: 'long',
    }),
);

// 2021
export const formatDateYear = (dateObj, locale) => formatDateYearMem(locale).format(dateObj);

const formatDateYearMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      year: 'numeric',
    }),
);

// Monday
export const formatDateWeekday = (dateObj, locale) => formatDateWeekdayMem(locale).format(dateObj);

const formatDateWeekdayMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'long',
    }),
);

// mo
export const formatDateWeekdayShort = (dateObj, locale) => formatDateWeekdayShortMem(locale).format(dateObj);

const formatDateWeekdayShortMem = memoizeOne(
  (locale) => new Intl.DateTimeFormat(locale.language, {
      weekday: 'short',
    }),
);
