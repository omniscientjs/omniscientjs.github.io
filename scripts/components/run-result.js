import React from 'react';
import component from './component-redux';

export default component(
  (state) => ({ stats: state.stats, failures: state.failures, errors: state.errors }),
  function Result ({ stats, failures, errors }) {

    const tests   = stats.tests,
          passes  = tests && stats.passes,
          pending = tests && stats.pending,
          failed = tests && stats.failures;

    const passesSummary = passes
      ? <span className="editor-success">{passes} of {tests} test{tests > 1 ? 's' : ''} passed</span>
      : null;

    const pendingPrefix = (passes && pending) ? ', ' : '';

    const pendingSummary = pending
      ? <span className="editor-pending">{pending} pending</span>
      : null;

    const failedPrefix = failed
      ? (passes || pending) ? ', ' : ''
      : null;

    const failedSummary = failed
      ? (passes || pending)
        ? <span className="editor-error">{failed} failed!</span>
        : <span className="editor-error">{failed} of {tests} test{tests > 1 ? 's' : ''} failed!</span>
      : null;

    const key = (...args) => args.map((a) => a.replace(/ /g, '-')).join('-');

    const testResults = failures.map((test) => {
      const suiteTitle = test.parent ? test.parent.title : '';
      return <div key={ key(suiteTitle, test.title) }>✘ {suiteTitle} {test.title}<div className="editor-error">{test.err.message}</div></div>;
    });

    const punctuation = failed ? '' : '.';

  return <div>
    { tests  ? <div className='test-summary'>{passesSummary}{pendingPrefix}{pendingSummary}{failedPrefix}{failedSummary}{punctuation}</div> : null }
    { tests  ? <div className='test-result'>{testResults}</div> : null}
    { errors ? <div className='editor-error'><pre>{errors}</pre></div> : null }
  </div>;
});
