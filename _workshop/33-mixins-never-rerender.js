---
layout: workshop
collection: workshop
title: Mixins - never rerender
section: 3
name: 33-mixins-never-rerender
next: 34-mixins-only-show-odd-numbers
slides: http://omniscientjs.github.io/workshop-talk
---

var NeverRerender = {
  shouldComponentUpdate: function () {
    return false;
  }
};

var Boring = React.createClass({
  mixins: [NeverRerender],
  render: function () {
    return <span>{this.props.name}</span>;
  }
});

React.render(<Boring name='something' />, el);
React.render(<Boring name='something else' />, el);
