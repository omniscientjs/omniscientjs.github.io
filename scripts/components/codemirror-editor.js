import component from './component-redux';
import React from 'react';
import ReactDOM from 'react-dom';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';

const throttledReplaceState = throttle(replaceStateValue, 2000);

export default component((state) => ({ code: state.code }),
                         [{

  componentDidMount: function () {
    const { isLarge, dispatch } = this.props;

    const options = {
      autoCloseBrackets: true,
      matchBrackets: true,
      lineNumbers: isLarge,
      lineWrapping: false,
      viewportMargin: Infinity,
      theme: 'xq-light',
      tabSize: 2,
      extraKeys: { Tab }
    };

    const onCodeMirrorChange = (editor) => {
      const src = editor.doc.getValue();
      dispatch({ type: "CODE_UPDATED", src: src });

      if (isLarge) {
        throttledReplaceState(src);
      }
    };

    const domNode = ReactDOM.findDOMNode(this);
    this.editor = CodeMirror.fromTextArea(domNode, options);
    this.editor.on('change', onCodeMirrorChange);

    if (isLarge) {
      let initialCode = location.hash.replace(/^#/, '');
      try {
        initialCode = decodeURIComponent(initialCode);
      }
      catch (ignore) { }
      const src = initialCode || this.props.code.src;
      this.editor.setValue(src);
    }
  },

  shouldComponentUpdate: function () {
    return false;
  }

}], function CodeMirrorEditor ({ code }) {
  return <textarea defaultValue={ code.src }></textarea>;
});

function Tab (cm) {
  if (cm.somethingSelected()) {
    cm.indentSelection("add");
  }
  else {
    cm.execCommand('insertSoftTab');
  }
}

function replaceStateValue (value) {
  history.replaceState(null, 'playground', `#${encodeURIComponent(value)}`);
}

function throttle (fn, ms) {
  let timeout;
  return function () {
    const self = this, args = [].slice.call(arguments);
    if (timeout) {
      clearTimeout(timeout);
      timeout = undefined;
    }
    timeout = setTimeout(function () {
      fn.apply(self, args);
    }, ms);
  };
}
