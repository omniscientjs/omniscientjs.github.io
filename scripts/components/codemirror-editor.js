import component from 'omniscient';
import React from 'react';
import ReactDOM from 'react-dom';

import CodeMirror from 'codemirror';
import 'codemirror/mode/javascript/javascript';

import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchbrackets';

const throttledReplaceState = throttle(replaceStateValue, 2000);

export default component([{

  componentDidMount: function () {
    const isLarge = this.props.statics.isLarge;

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

    const onCodeMirrorChange = editor => {
      const source = editor.doc.getValue();
      this.props.source.update(_ => source);

      if (isLarge) {
        throttledReplaceState(source);
      }
    };

    var domNode = ReactDOM.findDOMNode(this);
    this.editor = CodeMirror.fromTextArea(domNode, options);
    this.editor.on('change', onCodeMirrorChange);

    if (isLarge) {
      let initialCode = location.hash.replace(/^#/, '');
      try {
        initialCode = decodeURIComponent(initialCode);
      }
      catch (ignore) { }
      const source = initialCode || this.props.source.deref();
      this.editor.setValue(source);
    }
  },

  shouldComponentUpdate: function () {
    return false;
  }

}], function CodeMirrorEditor ({source}) {
  return <textarea defaultValue={source}></textarea>;
});

function Tab (cm) {
  if (cm.somethingSelected()) {
    cm.indentSelection("add");
  } else {
    cm.execCommand('insertSoftTab')
  }
}

function replaceStateValue (value) {
  history.replaceState(null, 'playground', '#' + encodeURIComponent(value));
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
