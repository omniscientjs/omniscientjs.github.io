import React from 'react';
import ReactDOM from 'react-dom';
import immstruct from 'immstruct';

import Editor from './components/editor';

const runnables = document.querySelectorAll('.editor');
for (let i = 0; i < runnables.length; i++) {
  const runnable = runnables[i];

  const textarea = runnable.querySelector('textarea');
  const source = textarea.value;
  runnable.removeChild(textarea);

  const isLarge = runnable.dataset.isLarge;
  createEditorRenderLoop(runnable, source, isLarge);
}

function createEditorRenderLoop (container, source, isLarge) {

  const data = immstruct({ source });
  const timers = { intervals: [], timeouts: [] };
  const render = () =>
    ReactDOM.render(
      <Editor
        source={data.cursor('source')}
        timers={timers}
        isLarge={isLarge} />,
      container);

  data.on('swap', () => render());
  render();
}
