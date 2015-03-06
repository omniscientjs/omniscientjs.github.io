---
layout: workshop
collection: workshop
title: Mixins - only show odd numbers
section: 3
name: 34-mixins-only-show-odd-numbers
next: 35-
slides: http://omniscientjs.github.io/workshop-talk
---

var OnlyShowOddNumbers = {
  shouldComponentUpdate: function (nextProps) {
    return nextProps.number % 2 !== 0;
  }
};

var OddNumbers = React.createClass({
  mixins: [OnlyShowOddNumbers],
  render: function () {
    return <span>{this.props.number}</span>;
  }
});

var n = 0;
setInterval(function () {
  React.render(OddNumbers({ number: n++ }), el);
}, 1000);
