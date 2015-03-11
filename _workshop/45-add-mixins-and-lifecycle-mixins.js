---
layout: workshop
collection: workshop
title: Add Mixins and Life Cycle Mixins
section: 3
name: 45-add-mixins-and-lifecycle-mixins
next: 46-create-filtering-search
prev: 44-omniscient-todo-app-with-cursors
slides: http://omniscientjs.github.io/workshop-slides/#74
---

// ---
// Assignment: Create a component that automatically gains
// focus when it is mounted. Next to the input, render
// a div that reflects the value of the input.
// ---

var component = omniscient.withDefaults({ jsx: true });

var focusOnRenderMixin = {
  // Create the componentDidMount life cycle method and
  // select the current dom node to put the mouse cursor inside it

};

// Create a FocusingInput component that makes use of the focusOnRenderMixin
var FocusingInput = component(function () {

  // Create an onChange function that will set the 'text' of the inputCursor
  // to the value of the input from the event

  // Create an input element that listens for change as you type
  // and that shows the 'text' of the inputCursor

});

var App = component(({inputCursor}) => (
  <div>
    <h1>Focusing input</h1>
    // show the 'text' of the inputCursor

    // render a FocusingInput passing the inputCursor as its prop

  </div>
));


// Create a immutable data structure

// Render every time immutable data swaps.

// Initial render
render();

function render () {
  React.render(<App />, el);
}
