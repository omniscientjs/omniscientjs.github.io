import { combineReducers } from 'redux';

const initCodeReducer = (source) =>
  function code (state = { src: source }, action) {
    switch (action.type) {
    case 'CODE_UPDATED':
        return { src: action.src };
    }

    return state;
  };

const initialTimers = () => ({ intervals: [], timeouts: [] });
function timers (state = initialTimers(), action) {
  switch (action.type) {
  case 'TIMERS_CLEAR':
    state.timeouts.forEach(id => clearTimeout(id));
    state.intervals.forEach(id => clearInterval(id));
    return initialTimers();

  case 'TIMERS_TIMEOUT_ADD':
    return { intervals: state.intervals, timeouts: [ ...state.timeouts, action.id ] };

  case 'TIMERS_INTERVAL_ADD':
    return { intervals: [ ...state.intervals, action.id ], timeouts: state.timeouts };
  }

  return state;
}

const initialErrors = () => null;
function errors (state = initialErrors(), action) {
  switch (action.type) {
  case 'ERRORS_SET':
    return action.errors;

  case 'ERRORS_REMOVE':
    return initialErrors();
  }

  return state;
}

const initialFailures = () => [];
function failures (state = initialFailures(), action) {
  switch (action.type) {
  case 'FAILURES_SET':
    return action.failures;

  case 'FAILURES_REMOVE':
    return initialFailures();
  }

  return state;
}

const initialStats = () => ({});
function stats (state = initialStats(), action) {
  switch (action.type) {
  case 'STATS_SET':
    return action.stats;

  case 'STATS_REMOVE':
    return initialStats();
  }
  return state;
}

const initialLogs = () => ([]);
function logs (state = initialLogs(), action) {
  switch (action.type) {
  case 'LOGS_ADD':
    return action.logs;

  case 'LOGS_REMOVE':
    return initialLogs();
  }
  return state;
}

export default (source) => combineReducers({
  code: initCodeReducer(source),
  timers,
  stats,
  errors,
  failures,
  logs
});
