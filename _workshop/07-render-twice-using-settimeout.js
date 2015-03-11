---
layout: workshop
collection: workshop
title: Render twice to update the view using setTimeout
section: 1
name: 07-render-twice-using-settimeout
prev: 06-render-two-times
next: 08-render-a-clock-using-setinterval
slides: http://omniscientjs.github.io/workshop-slides/#22
---
// ---
// Assignment: Make a Heading component with a h1 and a name
// and render it twice to the DOM. Add a delay between the rendering
// to observe the update.
// ---


// Make a React Class named Heading
// the component should show a h1 with name given on props
var Heading;

// Render the Heading component to the `el` element
// with a prop name set to "Janet van Dyne"


// Inside setTimeout with time of 2 seconds:
// Again: render the Heading component to the `el` element
// this time with a prop name set to "Wasp"
setTimeout(function () { }, 2000);











// Tests are below here, for guiding you

describe('workshop part 1', function () {

  it('should have class named Heading', function () {
    expect(React.isValidClass(Heading)).to.equal(true,
      'Heading must be a valid React class');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Janet van Dyne');

    setTimeout(function () {
      React.render(<Heading name="Wasp" />, el);
    }, 2050);

  });
});
