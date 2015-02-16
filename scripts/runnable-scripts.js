(function () {

  $script(['/scripts/vendor/codemirror-min.js',
          '//cdnjs.cloudflare.com/ajax/libs/immutable/3.6.2/immutable.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.min.js'], function () {
    $script(['//cdnjs.cloudflare.com/ajax/libs/immstruct/1.4.0/immstruct.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/omniscient/2.1.0/omniscient.min.js',
            '/scripts/vendor/browser.js'], runnableScriptsLoad);
  });

  function runnableScriptsLoad () {
    component = omniscient;
    var runnables = document.querySelectorAll('.editor');
    for (var i=0; i < runnables.length; i++) {
      createEditors(runnables[i]);
    }
  }

  function createEditors (runnable) {
    var isLarge = runnable.dataset['large'];
    var options = {
      lineNumbers: isLarge,
      lineWrapping: true,
      viewportMargin: Infinity,
      theme: 'kimbie-dark',
      tabSize: 2,
      extraKeys: {
        Tab: betterTab
      }
    };

    var editor = CodeMirror.fromTextArea(runnable, options);
    var src = editor.doc.getValue();

    var urlCode;

    if (isLarge) {
      var initialCode = location.hash.replace(/^#/, '');
      try {
        initialCode = decodeURIComponent(initialCode);
      }
      catch (ignore) { }
      src = initialCode || src;
      editor.setValue(src);
    }

    var timers = { timeouts: [], intervals: [] };
    editor.on('change', function () {
      run(isLarge, editor.doc.getValue(), timers);
    });
    run(isLarge, src, timers);
  }

  var throttledReplaceState = throttle(replaceStateValue, 2000);

  function run (isLarge, src, timers) {
    var match = src.match(/['"](result(-[0-9]+)?)['"]/);
    var resultEl;
    if (match && match[1]) {
      resultEl = document.getElementById(match[1]);
    }
    try {

      timers.timeouts.forEach(clearTimeout);
      timers.intervals.forEach(clearInterval);

      timers.timeouts = [];
      timers.intervals = [];

      var newSetTimeout = function () {
        var id = setTimeout.apply(this, arguments);
        timers.timeouts.push(id);
        return id;
      };
      var newSetInterval = function () {
        var id = setInterval.apply(this, arguments);
        timers.intervals.push(id);
        return id;
      };

      var compiledCode = to5.transform(src).code;
      var fn = Function.apply(null, [
        'setTimeout',
        'setInterval',
        compiledCode]);

      fn(newSetTimeout,
         newSetInterval);

      if (isLarge) {
        throttledReplaceState(src);
      }
    }
    catch (e) {
      var msg = e.message;
      if (resultEl) {
        var error = document.createElement('pre');
        error.innerHTML = msg;

        var errorEl = document.createElement('span');
        errorEl.className = 'editor-error';
        errorEl.appendChild(error);

        resultEl.innerHTML = '';
        resultEl.appendChild(errorEl);
      }
      else {
        console.error(msg);
      }
    }
  }

  function betterTab(cm) {
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
    var timeout;
    return function () {
      var self = this, args = [].slice.call(arguments);
      if (timeout) {
        clearTimeout(timeout);
        timeout = undefined;
      }
      timeout = setTimeout(function () {
        fn.apply(self, args);
      }, ms);
    };
  }
})();
