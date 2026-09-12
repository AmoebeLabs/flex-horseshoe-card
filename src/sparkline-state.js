/** Request lifecycle owned by SparklineHistory and reported per Series item. */
export const SPARKLINE_REQUEST_STATE = Object.freeze({
  NOT_LOADED: 'not_loaded',
  NOT_REQUIRED: 'not_required',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
  CLOSED: 'closed',
});

/** Processed-data outcome owned by each SparklineGraph. */
export const SPARKLINE_DATA_STATE = Object.freeze({
  NOT_LOADED: 'not_loaded',
  HAS_DATA: 'has_data',
  EMPTY: 'empty',
});

/** Completion decisions returned by SparklineHistory requests. */
export const SPARKLINE_HISTORY_RESULT = Object.freeze({
  ACCEPTED: 'accepted',
  FAILED: 'failed',
  STALE: 'stale',
});
