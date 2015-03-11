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

// ---
// Assignment: Create a clock component that will show
// the current time. Update the time property of the
// data structure at an interval and watch the time pass
// ---

var data = immstruct({ time: new Date() });

// Create a Clock component that deref()'s its time prop
// that holds a cursor to the `time` of `data`
// Remeber to call .toString() on the time to stringify it
var Clock;

// Create the render function. It should render the Clock component
// passing a prop `time` with a cursor to `time` of the `data` structure
var render = () => React.render(<div />, el);

render();

// At an interval update the `time` of data with a new value,
// so the clock will tick every second
setInterval(() => {

}, 1000);

// Rerender when data changes
