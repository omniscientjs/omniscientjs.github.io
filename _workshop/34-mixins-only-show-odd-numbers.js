---
layout: workshop
collection: workshop
title: Mixins - only show odd numbers
section: 3
name: 34-mixins-only-show-odd-numbers
next: 35-mixins-immutable-js-should-component-update
prev: 33-mixins-never-rerender
slides: http://omniscientjs.github.io/workshop-slides/#61
---

var onlyShowOddNumbers = {
  // Complete the shouldComponentUpdate mixin such that
  // it will only return true when the passed number
  // of the props is not divisible by two
  shouldComponentUpdate: function (nextProps) {
    return nextProps.number % 2 !== 0;
  }
};

var Numbers = React.createClass({
  render: function () {
    return <div>
      <AllNumbers number={this.props.number} />
      <OddNumbers number={this.props.number} />
    </div>;
  }
});

// Implement the AllNumbers component. It should
// render all numbers it gets passed on its props
var AllNumbers = React.createClass({
  render: function () {
    return <div>{this.props.number}</div>;
  }
});

// Implement the OddNumbers component. It should only
// render odd numbers it gets passed on its props
var OddNumbers = React.createClass({
  mixins: [onlyShowOddNumbers],
  render: function () {
    return <div>{this.props.number}</div>;
  }
});

// This loop will render your Numbers component
// passing both odd and even numbers
var n = 0;
setInterval(function () {
  React.render(<Numbers number={n++} />, el);
}, 1000);
