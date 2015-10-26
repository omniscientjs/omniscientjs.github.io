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

import CodeMirrorEditor from './codemirror-editor';
import RunResult from './run-result';
import PlaygroundReporter from '../playground-reporter';
import omniscient from 'omniscient';

var component = omniscient;

export default component(
  {
    renderResults: function (data) {
      var domNode = ReactDOM.findDOMNode(this).querySelector('.results');
      ReactDOM.render(
        <RunResult
          stats={data.cursor('stats')}
          failures={data.cursor('failures')}
          errorResult={data.cursor('errorResult')} />,
        domNode);
    },

    componentDidMount: function () {
      this.data = immstruct({});
      this.data.on('swap', () => this.renderResults(this.data.cursor()));
      runCode.call(this, this.data.cursor());
    },

    componentDidUpdate: function () {
      if (!this.data) return;
      runCode.call(this, this.data.cursor());
    }
  },
  function RunCode () {
    return <div>
      <div className='results'></div>
      <div className='react-result'></div>
    </div>
  });

const runCode = function () {
  console.clear();

  const { source, timers } = this.props;

  const src = source.deref();

  if (/\{this\}/.test(src)) // everything hangs when you do this, so don't run with it
    return;

  const hasTest = (/it\(/.test(src));

  const container = ReactDOM.findDOMNode(this);
  const resultEl = container.querySelector('.react-result');
  resultEl.innerHTML = ''; // clear previous results when compilation fails

  const cursor = this.data.cursor();

  cursor.update(data => {
    data = data.removeIn(['stats']);
    data = data.removeIn(['errorResult']);
    return data;
  });

  const context = {};
  const mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  timers.timeouts.forEach(id => clearTimeout(id));
  timers.intervals.forEach(id => clearInterval(id));

  timers.timeouts = [];
  timers.intervals = [];

  const newSetTimeout = function () {
    const id = setTimeout.apply(this, arguments);
    timers.timeouts.push(id);
    return id;
  };
  const newSetInterval = function () {
    const id = setInterval.apply(this, arguments);
    timers.intervals.push(id);
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
      mocha.run(reporter =>
        cursor.update(data => {
          data = data.removeIn(['errorResult']);
          data = data.updateIn(['stats'], _ => Immutable.fromJS(reporter.stats));
          data = data.updateIn(['failures'], _ => Immutable.fromJS(reporter.failures));
          return data;
        }));
    }
  }
  catch (e) {
    console.error(e);
    cursor.update(data => {
      data = data.updateIn(['errorResult'], _ => e.message);
      data = data.removeIn(['stats']);
      data = data.removeIn(['failures']);
      return data;
    });
  }
}
