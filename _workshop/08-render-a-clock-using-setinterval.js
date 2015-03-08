---
layout: workshop
collection: workshop
title: Render a clock using setInterval
section: 1
name: 08-render-a-clock-using-setinterval
prev: 07-render-twice-using-settimeout
slides: http://omniscientjs.github.io/workshop-talk
---

// make an React Class named Clock
// the component should show a p with time given on props
var Clock = React.createClass({
  render: function () {
    return <p>{this.props.time}</p>;
  }
});

// render the Clock component to the `el` element
// with a prop time set to string of new Date
React.render(<Clock time={new Date().toString()} />, el);

// Inside setInterval with a interval of 1 second:
//    Again: render the Clock component to the `el` element
//    with a prop time set to string of new Date
setInterval(function () {
  React.render(<Clock time={new Date().toString()} />, el);
}, 1000);












/*  Tests are below here, for guiding you  */






describe('workshop part 1', function () {

  it('should have class named Clock', function () {
    expect(React.isValidClass(Clock)).to.equal(true,
      'Clock must be a valid React class');
  });

});
