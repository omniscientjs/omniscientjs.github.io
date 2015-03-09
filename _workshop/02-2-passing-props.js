---
layout: workshop
collection: workshop
title: Transforming input props
section: 1
name: 02-2-passing-props
prev: 02-1-passing-props
next: 03-composing-components
slides: http://omniscientjs.github.io/workshop-slides/#10
---

// In this exercise you can use JSX

// 1) Make function uppercase which transforms input
// to upper case.
var uppercase;

// 2) Make a React Class named Hello
// This component should show "Hello, WORLD!" if no
// "name" on props, if else it should show "Hello, «NAME»!",
// where name is the name passed as prop.
var Hello;

// 3) Render on el
// Render component with name "react"






// Tests should turn green

describe('workshop part 1', function () {
  it('should have class named Hello', function () {
    expect(React.isValidClass(Hello)).to.equal(true,
      'Hello must be a valid React class');
  });

  it('should have function uppercase', function () {
    expect(uppercase).to.be.a('function',
      'uppercase must be a function');
  });

  it('should have component Hello with name from props', function () {
    var output = React.renderComponentToString(Hello({ name: 'foo'}));
    expect(output).to.contain('FOO');
  });

  it('should have component Hello with default name World', function () {
    var output = React.renderComponentToString(Hello());
    expect(output).to.contain('WORLD');
    expect(output).to.contain('<h1');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Hello, REACT!');
  });
});
