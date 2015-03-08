---
layout: workshop
collection: workshop
title: Add Mixins and Life Cycle Mixins
section: 3
name: 45-add-mixins-and-lifecycle-mixins
next: 36
slides: http://omniscientjs.github.io/workshop-talk
---

var component = omniscient.withDefaults({
  jsx: true
});


var focusOnRenderMixin = {
  componentDidMount: function () {
    this.getDOMNode().select();
  }
};


// Auto-focusable component.
var FocusingInput = component(focusOnRenderMixin, function ({inputCursor}) {
  var onChange = (e) => inputCursor.set('text', e.currentTarget.value);
  return <input onChange={onChange} value={inputCursor.get('text')} />;
});

var App = component(({inputCursor}) => (
  <div>
    <h1>Input: {inputCursor.get('text')}</h1>
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
