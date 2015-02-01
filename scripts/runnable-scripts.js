component = omniscient;
$$ = document.querySelectorAll.bind(document);
var runnables = $$('.js--run');
for (var i=0; i < runnables.length; i++) {
  createEditors(runnables[i]);
}

function createEditors (runnable) {
  runnable.contentEditable = true;
  runnable.addEventListener('keydown', onShiftEnter(function (e) {
    e.preventDefault();
  }));
  runnable.addEventListener('keyup', onShiftEnter(function (e) {
    run(runnable);
  }));
  run(runnable);
}

function onShiftEnter (fn) {
  return function (e) {
    if (e.shiftKey && e.keyCode === 13) fn(e);
  };
}

function run (runnable) {
  try {
    runnable.style.border = 'none';
    runnable.style.borderRadius = '3px';
    to5.run(runnable.textContent);
  }
  catch (e) {
    runnable.style.borderLeft = '3px solid #f25156';
    runnable.style.borderRadius = '0';
  }
}
