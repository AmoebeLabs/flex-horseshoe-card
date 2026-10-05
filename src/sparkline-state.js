/** History request status used to decide whether each Sparkline Series needs loading. */
export const SPARKLINE_REQUEST_STATE = Object.freeze({
  NOT_LOADED: 'not_loaded',
  NOT_REQUIRED: 'not_required',
  LOADING: 'loading',
  LOADED: 'loaded',
  ERROR: 'error',
  CLOSED: 'closed',
});

/** Distinguishes waiting for History, graph data to draw, and a successful empty response. */
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
