---
layout: workshop
collection: workshop
title: Passing Properties
section: 1
name: 02-passing-props
prev: 01-basic-components
next: 03-composing-components
slides: http://omniscientjs.github.io/workshop-talk
---

// In this exercise you can use JSX

// 1) Make React Class named "Hello"
// This component should show "Hello, World!" if no
// "name" on props, if else it should show "Hello, «Name»!",
// where name is the name passed as prop
var Hello = React.createClass({
  render: function () {
    var name = this.props.name || 'World';
    return <h1>Hello, {name}!</h1>;
  }
});

// 2) Render on document.getElementById('result')
// Render component with name "React"
React.render(<Hello name="React" />, el);

// Tests should turn green
var expect = chai.expect;
describe('workshop part 1', function () {
  it('should have class named Hello', function () {
    expect(React.isValidClass(Hello)).to.equal(true);
  });

  it('should have component with text HelloWorld', function () {
    var output = React.renderComponentToString(Hello({ name: 'Foo'}));
    expect(output).to.contain('Hello,');
    expect(output).to.contain('Foo');
    expect(output).to.contain('<h1');
  });

  it('should have component with text HelloWorld', function () {
    var output = React.renderComponentToString(Hello());
    expect(output).to.contain('Hello,');
    expect(output).to.contain('World');
    expect(output).to.contain('<h1');
  });

  it('should have rendered component', function () {
    var html = document.querySelector('#result').innerText;
    expect(html).to.contain('Hello, React!');
  });
});
