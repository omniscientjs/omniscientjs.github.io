---
layout: workshop
collection: workshop
title: Render a clock using setInterval
section: 1
name: 08-render-a-clock-using-setinterval
prev: 07-render-twice-using-settimeout
slides: http://omniscientjs.github.io/workshop-talk
---

var Clock = React.createClass({
  render: function () {
    return <p>{this.props.time}</p>;
  }
});

React.render(<Clock time={new Date().toString()} />, el);

setInterval(function () {
  React.render(<Clock time={new Date().toString()} />, el);
}, 1000);
