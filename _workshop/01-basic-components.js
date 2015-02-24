---
layout: workshop
collection: workshop
title: Making Basic Components
section: 1
name: 01-basic-components
next: 02-passing-props
slides: http://omniscientjs.github.io/workshop-talk
---

// In this exercise you can use JSX

// 1) Make React Class named "HelloWorld"
// with a h1 containing "Hello, World!"
var HelloWorld = React.createClass({
  render: function () {
    return <h1>Hello, World!</h1>;
  }
});

// 2) Render on document.getElementById('result')
React.render(<HelloWorld />, el);

// Tests should turn green
var expect = chai.expect;
describe('workshop part 1', function () {
  it('should have class named HelloWorld', function () {
    expect(React.isValidClass(HelloWorld)).to.equal(true);
  });

  it('should have component with text HelloWorld', function () {
    var output = React.renderComponentToString(HelloWorld());
    expect(output).to.contain('Hello, World!');
    expect(output).to.contain('<h1');
  });

  it('should have rendered component', function () {
    var html = document.querySelector('#result').innerText;
    expect(html).to.contain('Hello, World!');
  });
});
