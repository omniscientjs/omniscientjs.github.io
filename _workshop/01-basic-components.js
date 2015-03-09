---
layout: workshop
collection: workshop
title: Making Basic Components
section: 1
name: 01-basic-components
next: 02-1-passing-props
slides: http://omniscientjs.github.io/workshop-slides/#9
---

// In this exercise you can use JSX

// 1) Make a React Class named Hello
// the component should show a h1 with "Hello, World!"
var HelloWorld = React.createClass({
  render: function () {
    return <h1>Hello, World!</h1>;
  }
});

// 2) Render the Hello component to the `el` element
// with a prop name set to "React"
React.render(<HelloWorld />, el);







// Tests are below here, for guiding you

describe('workshop part 1', function () {

  it('should have class named HelloWorld', function () {
    expect(React.isValidClass(HelloWorld)).to.equal(true,
      'HelloWorld must be a valid React class');
  });

  it('should have component HelloWorld with text "Hello, World!"', function () {
    var output = React.renderComponentToString(HelloWorld());
    expect(output).to.contain('Hello, World!');
    expect(output).to.contain('<h1',
      'HelloWorld component should be a h1');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Hello, World!',
      'HelloWorld should be rendered to result div');
  });
});
