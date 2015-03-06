---
layout: workshop
collection: workshop
title: Immstruct - Hello, Hank
section: 3
name: 30-immstruct-hello-hank
next: 31-
slides: http://omniscientjs.github.io/workshop-talk
---


var data = immstruct({ name: 'World!' });

var Hello = React.createClass({
  render: function () {
    return React.DOM.h1({}, 'Hello, ' + this.props.name.deref() + '!');
  }
});

function render () {
  React.render(<Hello name={data.cursor('name')} />, el);
}

render();

data.on('swap', () => render());

setTimeout(function () {
  data.cursor('name').update(function () {
    return 'Hank Pym'
  });
}, 2000);

