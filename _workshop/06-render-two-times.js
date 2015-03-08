---
layout: workshop
collection: workshop
title: Render two times and see that only the second will be visible
section: 1
name: 06-render-two-times
prev: 05-rerendering-replacing-views
slides: http://omniscientjs.github.io/workshop-talk
---

var Heading = React.createClass({
  render: function () {
    return <h1>{this.props.name}</h1>;
  }
});

React.render(<Heading name="Janet van Dyne" />, el);
React.render(<Heading name="Wasp" />, el);
