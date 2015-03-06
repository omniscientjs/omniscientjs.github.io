---
layout: workshop
collection: workshop
title: Immstruct - counter
section: 3
name: 31-immstruct-counter
next: 32-
slides: http://omniscientjs.github.io/workshop-talk
---

var Counter  = React.createClass({

  render: function () {
    var counter = this.props.counter;
    var inc = (e) => counter.update(v => v + 1);
    return <button onClick={inc}>{counter.deref()}</button>;
  }
});


var data = immstruct({ counter: 0 });

var render = () => React.render(<Counter counter={data.cursor('counter')} />, el);
data.on('swap', () => render());
render();
