---
layout: workshop
collection: workshop
title: Render a clock using setInterval
section: 1
name: 08-render-a-clock-using-setinterval
prev: 07-render-twice-using-settimeout
next: 20-higher-order-functions
slides: http://omniscientjs.github.io/workshop-slides/#22
---

// Make a React Class named Clock
// the component should show a p with time given on props
var Clock;

// Render the Clock component to the `el` element
// with a prop time set to string of new Date


// Inside setInterval with a interval of 1 second:
//    Again: render the Clock component to the `el` element
//    with a prop time set to string of new Date
setInterval(function () { }, 1000);













// Tests are below here, for guiding you

describe('workshop part 1', function () {

  it('should have class named Clock', function () {
    expect(React.isValidClass(Clock)).to.equal(true,
      'Clock must be a valid React class');
  });

});
