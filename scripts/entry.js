import React from 'react';
import ReactDOM from 'react-dom';
import immstruct from 'immstruct';

import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import Editor from './components/editor';
import reducers from './reducers';

const runnables = document.querySelectorAll('.editor');
for (let i = 0; i < runnables.length; i++) {
  const runnable = runnables[i];

  const textarea = runnable.querySelector('textarea');
  const source = textarea.value;
  runnable.removeChild(textarea);

  const isLarge = runnable.dataset.isLarge;
  createEditor(runnable, source, isLarge);
}

function createEditor(container, source, isLarge) {
  const debugStore = compose(applyMiddleware(thunk));
  const store = debugStore(createStore)(reducers(source));

  ReactDOM.render(
    <Provider store={ store }>
      <Editor isLarge={ isLarge }/>
     </Provider>,
    container);
}
