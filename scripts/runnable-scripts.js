(function () {

  $script(['/scripts/vendor/codemirror-min.js',
          '/scripts/playground-reporter.js',
          '//cdnjs.cloudflare.com/ajax/libs/chai/2.0.0/chai.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/mocha/2.1.0/mocha.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/immutable/3.6.2/immutable.min.js',
          '//cdnjs.cloudflare.com/ajax/libs/react/0.12.2/react.min.js'], function () {
    $script(['//cdnjs.cloudflare.com/ajax/libs/immstruct/1.4.0/immstruct.min.js',
            '//cdnjs.cloudflare.com/ajax/libs/omniscient/2.1.0/omniscient.min.js',
            '/scripts/vendor/browser.js'], runnableScriptsLoad);
  });

  function runnableScriptsLoad () {
    chai.should();
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
      lineWrapping: false,
      viewportMargin: Infinity,
      theme: 'base16-mocha-dark',
      tabSize: 2,
      extraKeys: {
        Tab: betterTab
      }
    };
    
    var editor = CodeMirror.fromTextArea(runnable.querySelector('textarea'), options);
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
      run(runnable, isLarge, editor.doc.getValue(), timers);
    });
    run(runnable, isLarge, src, timers);
  }

  var throttledReplaceState = throttle(replaceStateValue, 2000);

  function run (runnable, isLarge, src, timers) {
    var context = {};
    var mocha = new Mocha({ reporter: PlaygroundReporter });
    mocha.suite.emit('pre-require', context, null, mocha);

    var resultEl = runnable.querySelector('.result');

    var testResultEl = runnable.querySelector('.test-result');
    if (testResultEl) {
      testResultEl.innerHTML = '';
    }
    
    var testSummaryEl = runnable.querySelector('.test-summary');
    if (testSummaryEl) {
      testSummaryEl.innerHTML = '';
    }
    
    var hasTest;
    if (/describe\(/.test(src)) {
      hasTest = true;
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
        'el',
        'setTimeout',
        'setInterval',
        'describe',
        'it',
        'xdescribe',
        'xit',
        compiledCode]);

      var it = context.it.bind(context);
      it.only = context.it.only.bind(context);

      fn(resultEl,
         newSetTimeout,
         newSetInterval,
         context.describe.bind(context),
         it,
         context.xdescribe.bind(context),
         context.xit.bind(context));

      if (isLarge) {
        throttledReplaceState(src);
      }

      var errorElement = document.querySelector('.editor-error');
      if (errorElement) {
        errorElement.parentElement.removeChild(errorElement);
      }

      if (hasTest) {
        mocha.run(function (reporter) {
          testsDone(testResultEl, testSummaryEl, reporter);
        });
      }
    }
    catch (e) {
      console.error(e);
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

  function testsDone (testResultEl, testSummaryEl, reporter) {
    var stats = reporter.stats;
    var tests = stats.tests;
    var failures = stats.failures;
    var passes = stats.passes;
    var pending = stats.pending;

    var summary = '';
    if (passes) {
      summary += '<span class="editor-success">' + passes + ' of ' + tests + ' test' + (tests > 1 ? 's' : '') + ' passed</span>';
    }

    if (pending) {
      summary += (passes ? ', ' : '') + '<span class="editor-pending">' + pending + ' pending</span>'
    }

    var details;
    if (failures) {
      summary += (passes || pending)
        ? ', <span class="editor-error">' + failures + ' failed!</span>'
        : '<span class="editor-error">' + failures + ' of ' + tests + ' test' + (tests > 1 ? 's' : '') + ' failed!</span>';

      details = reporter.failures.map(function (failure) {
        var err = failure.err;
        return '✘ ' + failure.title + '<br>- ' + err.message + '<pre>' + err.stack + '</pre>';
      }).join('<br>');
    }
    else {
      summary += '.';
    }

    if (testSummaryEl) {
      testSummaryEl.innerHTML = summary;
    }

    if (testResultEl && details) {
      testResultEl.innerHTML = '<div class="editor-error">' + details + '</div>';
    }
  }
})();
