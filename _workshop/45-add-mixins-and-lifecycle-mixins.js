---
layout: workshop
collection: workshop
title: Add Mixins and Life Cycle Mixins
section: 3
name: 45-add-mixins-and-lifecycle-mixins
next: 46-create-filtering-search
prev: 44-omniscient-todo-app-with-cursors
slides: http://omniscientjs.github.io/workshop-talk
---

var component = omniscient.withDefaults({ jsx: true });

var focusOnRenderMixin = {
  // create the componentDidMount life cycle method and
  // select the current dom node to put the mouse cursor inside it
  componentDidMount: function () {
    this.getDOMNode().select();
  }
};

// create a FocusingInput component that makes use of the focusOnRenderMixin
var FocusingInput = component(focusOnRenderMixin, function ({inputCursor}) {

  // create an onChange function that will set the 'text' of the inputCursor
  // to the value of the input from the event
  var onChange = (e) => {
    inputCursor.set('text', e.currentTarget.value);
  };

  // create an input element that listens for change as you type
  // and that shows the 'text' of the inputCursor
  return <input onChange={onChange} value={inputCursor.get('text')} />;
});

var App = component(({inputCursor}) => (
  <div>
    // show the 'text' of the inputCursor
    <h1>Input: {inputCursor.get('text')}</h1>

    // render a FocusingInput passing the inputCursor as its prop
    <FocusingInput inputCursor={inputCursor} />
  </div>
));


// Create a immutable data structure
var data = immstruct({
  text: 'Gambit'
});

// Render every time immutable data swaps.
data.on('swap', render);

// Initial render
render();

function render () {
  React.render(<App inputCursor={data.cursor()} />, el);
}
