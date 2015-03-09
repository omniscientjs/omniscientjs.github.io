---
layout: workshop
collection: workshop
title: Immstruct - clock
section: 3
name: 32-immstruct-clock
next: 33-mixins-never-rerender
prev: 31-immstruct-counter
slides: http://omniscientjs.github.io/workshop-slides/#57
---

var data = immstruct({ time: new Date() });

// Create a Clock component that deref()'s its time prop
// that holds a cursor to the `time` of `data`
// Remeber to call .toString() on the time to stringify it
var Clock = React.createClass({
  render: function () {
    var time = this.props.time.deref().toString()
    return <span>{time}</span>;
  }
});

// Create the render function. It should render the Clock component
// passing a prop `time` with a cursor to `time` of the `data` structure
var render = () => React.render(<Clock time={data.cursor('time')} />, el);
render();

// At an interval update the `time` of data with a new value,
// so the clock will tick every second
setInterval(() => {
  data.cursor('time').update(_ => new Date());
}, 1000);

// Rerender when data changes
data.on('swap', render);
