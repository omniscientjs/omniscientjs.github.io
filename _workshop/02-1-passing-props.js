---
layout: workshop
collection: workshop
title: Passing Properties
section: 1
name: 02-1-passing-props
prev: 01-basic-components
next: 02-2-passing-props
slides: http://omniscientjs.github.io/workshop-slides/#10
---


// 1) Make a React Class named Hello
// the component should show "Hello, World!" if no name is given on props,
// otherwise it should show "Hello, «Name»!",
var Hello = React.createClass({
  render: function () {
    var name = this.props.name || 'World';
    return <h1>Hello, {name}!</h1>;
  }
});

// 2) Render the Hello component to the `el` element
// with a prop name set to "React"
React.render(<Hello name="React" />, el);






// Tests are below here, for guiding you

describe('workshop part 1', function () {

  it('should have class named Hello', function () {
    expect(React.isValidClass(Hello)).to.equal(true,
      'Hello must be a valid React class');
  });

  it('should have component Hello with name from props', function () {
    var output = React.renderComponentToString(Hello({ name: 'Foo'}));
    expect(output).to.contain('Hello,');
    expect(output).to.contain('Foo');
    expect(output).to.contain('<h1');
  });

  it('should have component Hello with default name World', function () {
    var output = React.renderComponentToString(Hello());
    expect(output).to.contain('Hello,');
    expect(output).to.contain('World');
    expect(output).to.contain('<h1');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Hello, React!');
  });
});
