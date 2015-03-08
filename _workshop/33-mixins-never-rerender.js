---
layout: workshop
collection: workshop
title: Mixins - never rerender
section: 3
name: 33-mixins-never-rerender
next: 34-mixins-only-show-odd-numbers
prev: 32-immstruct-clock
slides: http://omniscientjs.github.io/workshop-talk
---

var neverRerender = {
  shouldComponentUpdate: function () {
    return false;
  }
};

var Boring = React.createClass({
  mixins: [neverRerender],
  render: function () {
    return <span>{this.props.name}</span>;
  }
});

React.render(<Boring name='something' />, el);
React.render(<Boring name='something else' />, el);
