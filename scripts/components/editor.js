import React from 'react';
import component from './component';

import CodeMirrorEditor from './codemirror-editor';
import RunCode from './run-code';
import RunResult from './run-result';

export default component(function Editor (props) {

  return <div className='window editor'>
    <div className='inner inner--code'>
    <CodeMirrorEditor { ...props }/>
    </div>
    <div className="inner inner--result">
      <RunCode />
      <RunResult />
    </div>
  </div>;
});
