---
layout: workshop
collection: workshop
title: Immstruct - counter
section: 3
name: 31-immstruct-counter
next: 32-immstruct-clock
prev: 30-immstruct-hello-hank
slides: http://omniscientjs.github.io/workshop-slides/#57
---


// Create a Counter component
// The component should render a button that when clicked
// will increate the value of the `counter` cursor it is passed
// This should make the component rerender
var Counter  = React.createClass({

  render: function () {
    var counter = this.props.counter;
    var inc = (e) => counter.update(v => v + 1);
    return <button onClick={inc}>{counter.deref()}</button>;
  }
});


var data = immstruct({ counter: 0 });

// Render the Counter component with a prop `counter` with a cursor
// of the `counter` property in data
var render = () => React.render(<Counter counter={data.cursor('counter')} />, el);

render();

// When data changes, rerender
data.on('swap', render);
