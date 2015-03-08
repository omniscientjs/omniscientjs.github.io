---
layout: workshop
collection: workshop
title: Immstruct - Hello, Hank
section: 3
name: 30-immstruct-hello-hank
next: 31-immstruct-counter
prev: 24-cursors
slides: http://omniscientjs.github.io/workshop-talk
---


var data = immstruct({ name: 'World!' });

// Create a Hello component that accepts a cursor for a name
// and renders "Hello, <name>!" 
var Hello = React.createClass({
  render: function () {
    return React.DOM.h1({}, 'Hello, ' + this.props.name.deref() + '!');
  }
});

function render () {
  // Render the component with a cursor to name of the `data` structure
  React.render(<Hello name={data.cursor('name')} />, el);
}

render();

// When data changes, rerender
data.on('swap', () => render());

setTimeout(function () {
  // Update the value of name in with the name 'Hank Pym'
  data.cursor('name').update(function () {
    return 'Hank Pym'
  });
}, 2000);

