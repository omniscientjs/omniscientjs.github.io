import React from 'react';
import Immutable from 'immutable';
import immstruct from 'immstruct';
import chai from 'chai';

// TODO y no worky?
// import Mocha from 'mocha/mocha';
// import to5 from '6to5/browser';

import CodeMirrorEditor from './codemirror-editor';
import PlaygroundReporter from '../playground-reporter';
import omniscient from 'omniscient';
import component from './component';

let Result = component(function Result ({ stats, failures, errorResult }) {

    console.log(failures);

    const passes  = stats.get('passes'),
          tests   = stats.get('tests'),
          pending = stats.get('pending'),
          failed = stats.get('failures');

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

    const testResults = failures.toArray().map(failure => {
      return <div>✘ {failure.title}<br/>- {failure.err.message} <pre>{failure.err.stack}</pre></div>
    });

  return <div>
    <div className='test-summary'>{passesSummary}{pendingPrefix}{pendingSummary}{failedPrefix}{failedSummary}</div>
    <div className='editor-error'>{errorResult.deref()}</div>
    <div className='test-result'>{testResults}</div>
  </div>;
});
//<div className='test-result' dangerouslySetInnerHTML={{__html: testResult.deref()}}></div>

export default component(
  {
    renderResults: function (data) {
      React.render(
        <Result
          stats={data.cursor('stats')}
          failures={data.cursor('failures')}
          errorResult={data.cursor('errorResult')} />,
        this.getDOMNode().querySelector('.results'));
    },

    componentDidMount: function () {
      this.data = immstruct({  });
      this.data.on('swap', () => this.renderResults(this.data.cursor()));
      runCodeOnUpdate.call(this, this.data.cursor());
    },

    componentDidUpdate: function () {
      if (!this.data) return;
      runCodeOnUpdate.call(this, this.data.cursor());
    }
  },
  function RunCode () {
    return <div>
      <div className='results'></div>
      <div className='result'></div>
    </div>
  });

let runCodeOnUpdate = function () {
  let { source, statics } = this.props;

  var container = this.getDOMNode();
  let resultEl = container.querySelector('.result');
  resultEl.innerHTML = '';

  runCode(source, statics.timers, this.data.cursor(), resultEl);
};

function runCode (source, timers, cursor, resultEl) {
  var context = {};
  var mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  cursor.update(data => {
    data = data.removeIn(['stats']);
    data = data.removeIn(['errorResult']);
    return data;
  });

  var src = source.deref();

  var hasTest;
  if (/describe\(/.test(src)) {
    hasTest = true;
  }

  try {
    timers.timeouts.forEach(clearTimeout);
    timers.intervals.forEach(clearInterval);

    timers.timeouts = [];
    timers.intervals = [];

    var newSetTimeout = function () {
      var id = setTimeout.apply(this, arguments);
      timers.timeouts.push(id);
      return id;
    };
    var newSetInterval = function () {
      var id = setInterval.apply(this, arguments);
      timers.intervals.push(id);
      return id;
    };

    var compiledCode = to5.transform(src).code;
    var fn = Function.apply(null, [
      'React', 'Immutable', 'immstruct', 'component',
      'el',
      'setTimeout', 'setInterval',
      'chai', 'expect', 'describe', 'it', 'xdescribe', 'xit',
        compiledCode]);

    var it = context.it.bind(context);
    it.only = context.it.only.bind(context);

    fn(React, Immutable, immstruct, omniscient,
       resultEl,
       newSetTimeout, newSetInterval,
       chai, chai.expect, context.describe.bind(context), it, context.xdescribe.bind(context), context.xit.bind(context)
       // TODO beforeEach afterEach before after
       );

    if (hasTest) {
      mocha.run(testsDone(cursor));
    }
  }
  catch (e) {
    console.error(e);
    cursor.updateIn(['errorResult'], _ => e.message);
  }
}

function testsDone (cursor) {
  return (reporter) =>
    cursor.update(data => {
      data = data.updateIn(['errorResult'], _ => '');
      data = data.updateIn(['stats'], _ => Immutable.fromJS(reporter.stats));
      data = data.updateIn(['failures'], _ => Immutable.fromJS(reporter.failures));
      return data;
    });
}
