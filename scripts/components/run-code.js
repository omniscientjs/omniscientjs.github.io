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

let Result = component(function Result ({ testSummary, testResult, errorResult }) {
  return <div>
    <div className='test-summary' dangerouslySetInnerHTML={{__html: testSummary.deref()}}></div>
    <div className='editor-error' dangerouslySetInnerHTML={{__html: errorResult.deref()}}></div>
    <div className='test-result' dangerouslySetInnerHTML={{__html: testResult.deref()}}></div>
  </div>;
});

export default component(
  {
    renderResults: function (data) {
      React.render(
        <Result
          testSummary={data.cursor('testSummary')}
          testResult={data.cursor('testResult')}
          errorResult={data.cursor('errorResult')}
        />,
        this.getDOMNode().querySelector('.results'));
    },

    componentDidMount: function () {
      this.data = immstruct({ testSummary: '', testResult: '', errorResult: '' });
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

  runCode(source, statics.timers, this.data.cursor(), resultEl);
};

function runCode (source, timers, cursor, resultEl) {
  var context = {};
  var mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  cursor.update(data => {
    data = data.updateIn(['testSummary'], _ => '');
    data = data.updateIn(['errorResult'], _ => '');
    data = data.updateIn(['testResult'],  _ => '');
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
    // console.error(e);
    cursor.updateIn(['errorResult'], _ => e.message);
  }
}

function testsDone (cursor) {
  return (reporter) => {
    var stats = reporter.stats;
    var tests = stats.tests;
    var failures = stats.failures;
    var passes = stats.passes;
    var pending = stats.pending;

    var summary = '';
    if (passes) {
      summary += '<span class="editor-success">' + passes + ' of ' + tests + ' test' + (tests > 1 ? 's' : '') + ' passed</span>';
    }

    if (pending) {
      summary += (passes ? ', ' : '') + '<span class="editor-pending">' + pending + ' pending</span>'
    }

    var details;
    if (failures) {
      summary += (passes || pending)
        ? ', <span class="editor-error">' + failures + ' failed!</span>'
        : '<span class="editor-error">' + failures + ' of ' + tests + ' test' + (tests > 1 ? 's' : '') + ' failed!</span>';

      details = reporter.failures.map(function (failure) {
        var err = failure.err;
        return '✘ ' + failure.title + '<br>- ' + err.message + '<pre>' + err.stack + '</pre>';
      }).join('<br>');
    }
    else {
      summary += '.';
    }

    cursor.update(data => {
      data = data.updateIn(['errorResult'], _ => '');
      data = data.updateIn(['testSummary'], _ => summary);
      data = data.updateIn(['testResult'],  _ => details);
      return data;
    });

  }
}
