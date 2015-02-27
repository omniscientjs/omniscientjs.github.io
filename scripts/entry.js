import React from 'react';
import immstruct from 'immstruct';

import Editor from './components/editor';

let runnables = document.querySelectorAll('.editor');
for (let i = 0; i < runnables.length; i++) {
  let runnable = runnables[i];

  let textarea = runnable.querySelector('textarea');
  let source = textarea.value;
  runnable.removeChild(textarea);

  let isLarge = runnable.dataset.isLarge;
  createEditorRenderLoop(runnable, source, isLarge);
}

function createEditorRenderLoop (container, source, isLarge) {

  const data = immstruct({ source });
  const timers = { intervals: [], timeouts: [] };
  const render = () =>
    React.render(
      <Editor
        source={data.cursor('source')}
        statics={{ timers, isLarge }} />,
      container);

  data.on('swap', () => render());
  render();
}
