(function () {

  $script(['scripts/vendor/codemirror-min.js',
          '//cdnjs.cloudflare.com/ajax/libs/immutable/3.6.2/immutable.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.min.js'], function () {
    $script(['//cdnjs.cloudflare.com/ajax/libs/immstruct/1.4.0/immstruct.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/omniscient/2.1.0/omniscient.min.js',
            'scripts/vendor/browser.js'], runnableScriptsLoad);
  });

  function runnableScriptsLoad () {
    component = omniscient;
    var runnables = document.querySelectorAll('.editor');
    for (var i=0; i < runnables.length; i++) {
      createEditors(runnables[i]);
    }
  }

  function createEditors (runnable) {
    var editor = CodeMirror.fromTextArea(runnable, {
      lineWrapping: true,
      viewportMargin: Infinity,
      theme: 'kimbie-dark'
    });
    editor.on('change', function () {
      run(editor);
    });
    run(editor);
  }

  function run (editor) {
    var src = editor.doc.getValue();
    var match = src.match(/['"](editor-[0-9]+)['"]/);
    var resultEl;
    if (match && match[1]) {
      resultEl = document.getElementById(match[1]);
    }
    try {
      to5.run(src);
    }
    catch (e) {
      var msg = e.message;
      if (resultEl) {
        resultEl.innerHTML = '';
        var errorEl = document.createElement('span');
        errorEl.className = 'editor-error';
        // var error = document.createTextNode(msg)
        var error = document.createElement('pre');
        error.innerText = msg;
        errorEl.appendChild(error);
        resultEl.appendChild(errorEl);
      }
      else {
        console.error(msg);
      }
    }
  }
})();
