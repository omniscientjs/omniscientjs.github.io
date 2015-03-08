---
layout: workshop
collection: workshop
title: Render two times and see that only the second will be visible
section: 1
name: 06-render-two-times
prev: 04-composing-through-children
next: 07-render-twice-using-settimeout
slides: http://omniscientjs.github.io/workshop-talk
---

// Make a React Class named Heading
// the component should show a h1 with name given on props
var Heading = React.createClass({
  render: function () {
    return <h1>{this.props.name}</h1>;
  }
});


// Render the Heading component to the `el` element
// with a prop name set to "Janet van Dyne"
React.render(<Heading name="Janet van Dyne" />, el);


// Again: render the Heading component to the `el` element
// this time with a prop name set to "Wasp"
React.render(<Heading name="Wasp" />, el);










// Tests are below here, for guiding you

describe('workshop part 1', function () {

  it('should have class named Heading', function () {
    expect(React.isValidClass(Heading)).to.equal(true,
      'Heading must be a valid React class');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Wasp');
  });
});
