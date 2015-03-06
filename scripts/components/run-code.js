import React from 'react';
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
import component from './component';

export default component(
  {
    renderResults: function (data) {
      React.render(
        <RunResult
          stats={data.cursor('stats')}
          failures={data.cursor('failures')}
          errorResult={data.cursor('errorResult')} />,
        this.getDOMNode().querySelector('.results'));
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

  const { source, statics } = this.props;

  const container = this.getDOMNode();
  const resultEl = container.querySelector('.react-result');
  resultEl.innerHTML = ''; // clear previous results when compilation fails

  const cursor = this.data.cursor();

  const context = {};
  const mocha = new Mocha({ reporter: PlaygroundReporter });
  mocha.suite.emit('pre-require', context, null, mocha);

  cursor.update(data => {
    data = data.removeIn(['stats']);
    data = data.removeIn(['errorResult']);
    return data;
  });

  const src = source.deref();

  const hasTest = (/it\(/.test(src));

  const timers = statics.timers;
  try {
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

    const compiledCode = to5.transform(src).code;
    const fn = Function.apply(null, [
      'React', 'Immutable', 'Cursor', 'immstruct', 'component',
      'el',
      'setTimeout', 'setInterval',
      'chai', 'expect', 'describe', 'it', 'xdescribe', 'xit',
        compiledCode]);

    const it = context.it.bind(context);
    it.only = context.it.only.bind(context);

    fn(React, Immutable, Cursor, immstruct, omniscient,
       resultEl,
       newSetTimeout, newSetInterval,
       chai, chai.expect, context.describe.bind(context), it, context.xdescribe.bind(context), context.xit.bind(context)
       // TODO beforeEach afterEach before after
       );

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
