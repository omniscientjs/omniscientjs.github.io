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

  let data = immstruct({
    source
  });

  let render = () =>
    React.render(
      <Editor
        source={data.cursor('source')}
        statics={{
          timers: { intervals: [], timeouts: [] },
          isLarge: isLarge
        }}
      />,
      container);

  data.on('swap', () => render());
  render();
}
