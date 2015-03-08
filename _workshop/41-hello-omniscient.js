---
layout: workshop
collection: workshop
title: Hello Omniscient
section: 3
name: 41-hello-omniscient
next: 42-hello-omniscient-jsx
prev: 40-omniscients-shouldComponentUpdate-in-react
slides: http://omniscientjs.github.io/workshop-talk
---

// make an omniscient component named Hello
// the component should show "Hello, World!" if no name is given on props,
// otherwise it should show "Hello, «Name»!",
// where name is the name passed as prop
var Hello = component(function (props) {
  var name = props.name || 'World';
  return <h1>Hello, {name}!</h1>;
});

// render the Hello component to the `el` element
// with a prop name set to "React"
React.render(Hello({ name: 'React' }), el);







// TESTS

// Tests should turn green
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
