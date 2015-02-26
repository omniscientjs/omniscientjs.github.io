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

let runCodeOnUpdate = function () {
  let { source, statics } = this.props;
  let resultEl = this.getDOMNode();
  resultEl.innerHTML = '';
  runCode(source, statics.timers, resultEl);
};

let RunCode = component(
  {
    componentDidMount: runCodeOnUpdate,
    componentDidUpdate: runCodeOnUpdate
  },
  function RunCode () {
    return <div className='result'></div>;
  });

let ErrorResult = component(
  function ErrorResult ({ errorResult }) {
    return <div className='editor-error'>
      <pre>{errorResult.deref()}</pre>
    </div>;
  });

export default component(
  function Editor ({ source }, { isLarge, timers }) {

  return <div className='window editor'>
    <div className='inner inner--code'>
      <CodeMirrorEditor
        source={source}
        statics={{isLarge}}
        />
    </div>
    <div className="inner inner--result">
      <RunCode
        source={source}
        statics={{timers}}
        />
    </div>
  </div>;
});

/*
<div className='test-summary'>{testResult.deref()}</div>
<ErrorResult errorResult={errorResult} />
<div className='test-result'>{testResult.deref()}</div>
*/


function runCode (source, timers, resultEl) {
  var context = {};
  var mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

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
      mocha.run(testsDone);
    }
    // errorResult.update(_ => '');
  }
  catch (e) {
    console.error(e);
    // errorResult.update(_ => e.message);
  }
}

function testsDone (reporter) {
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

  console.log(summary);
  console.log(details);

  // if (testSummaryEl) {
  //   testSummaryEl.innerHTML = summary;
  // }

//   if (testResultEl && details) {
//     testResultEl.innerHTML = '<div class="editor-error">' + details + '</div>';
//   }

}
