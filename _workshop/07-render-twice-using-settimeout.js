---
layout: workshop
collection: workshop
title: Render twice to update the view using setTimeout
section: 1
name: 07-render-twice-using-settimeout
prev: 06-render-two-times
slides: http://omniscientjs.github.io/workshop-talk
---

var Heading = React.createClass({
  render: function () {
    return <h1>{this.props.name}</h1>;
  }
});

React.render(<Heading name="Janet van Dyne" />, el);

setTimeout(function () {
  React.render(<Heading name="Wasp" />, el);
}, 2000);
