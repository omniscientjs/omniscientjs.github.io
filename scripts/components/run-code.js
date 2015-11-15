import React from 'react';
import ReactDOM from 'react-dom';
import Immutable from 'immutable';
import Cursor from 'immutable/contrib/cursor';
import immstruct from 'immstruct';
import chai from 'chai';
chai.should();

// TODO y no worky?
// import Mocha from 'mocha/mocha';
// import to5 from '6to5/browser';

import PlaygroundReporter from '../playground-reporter';
import omniscient from 'omniscient';
import component from './component-redux';

export default component(
  (state) => ({ code: state.code }),
  {
    componentDidMount: runCode,
    componentDidUpdate: runCode
  },
  function RunCode () {
    return <div ref="result"></div>;
  });

function runCode () {
  console.clear();

  const { code, dispatch } = this.props;

  const src = code.src;

  if (/\{this\}/.test(src)) // everything hangs when you do this, so don't run with it
    return;

  const hasTest = (/it\(/.test(src));

  const resultEl = this.refs.result;
  resultEl.innerHTML = ''; // clear previous results when compilation fails

  dispatch({ type: "STATS_REMOVE" });
  dispatch({ type: "ERRORS_REMOVE" });
  dispatch({ type: "TIMERS_CLEAR" });

  const context = {};
  const mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  const newSetTimeout = function () {
    const id = setTimeout.apply(this, arguments);
    dispatch({ type: "TIMERS_TIMEOUT_ADD", id: id });
    return id;
  };
  const newSetInterval = function () {
    const id = setInterval.apply(this, arguments);
    dispatch({ type: "TIMERS_INTERVAL_ADD", id: id });
    return id;
  };

  try {
    const srcWithoutComments = src.replace(/\s+?\/\/.*/g, '');
    const compiledCode = to5.transform(srcWithoutComments).code;

    const fn = Function.apply(null, [
      'React', 'ReactDOM', 'Immutable', 'Cursor', 'immstruct', 'component', 'omniscient',
      'el',
      'setTimeout', 'setInterval',
      'chai', 'expect',
      'describe', 'xdescribe',
      'it', 'xit',
      'before', 'beforeEach',
      'after', 'afterEach',
        compiledCode]);

    const it = context.it.bind(context);
    it.only = context.it.only.bind(context);

    fn(React, ReactDOM, Immutable, Cursor, immstruct, omniscient, omniscient,
       resultEl,
       newSetTimeout, newSetInterval,
       chai, chai.expect,
       context.describe.bind(context), context.xdescribe.bind(context),
       it, context.xit.bind(context),
       context.before.bind(context), context.beforeEach.bind(context),
       context.after.bind(context), context.afterEach.bind(context));

    if (hasTest) {
      mocha.run(reporter => {
        dispatch({ type: "ERRORS_REMOVE" });
        dispatch({ type: "STATS_SET", stats: reporter.stats });
        dispatch({ type: "FAILURES_SET", failures: reporter.failures });
      });
    }
  }
  catch (e) {
    console.error(e);
    dispatch({ type: "ERRORS_SET", errors: e.message });
    dispatch({ type: "STATS_REMOVE" });
    dispatch({ type: "FAILURES_REMOVE" });
  }
}
