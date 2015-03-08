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

// Create the `neverRerender` mixin. It should comprise
// a shouldComponentUpdate that tells the component never to
// re-render
var neverRerender = {
  shouldComponentUpdate: function () {
    return false;
  }
};

// Create a component Boring that mixes in the neverRerender mixin
// The Boring component should render its prop `name`
var Boring = React.createClass({
  mixins: [neverRerender],
  render: function () {
    return <span>{this.props.name}</span>;
  }
});

React.render(<Boring name='something' />, el);

// Render the component again with another value for `name`
// The component should not show this value, as it will
// never re-render
React.render(<Boring name='something else' />, el);
