---
layout: workshop
collection: workshop
title: Composing Simple Components
section: 1
name: 03-composing-components
prev: 02-passing-props
next: 04-composing-through-children
slides: http://omniscientjs.github.io/workshop-talk
---

// In this exercise you can use JSX

// 1)
var User = React.createClass({
  render: function () {
    var name = this.props.name || 'John Smith';
    return <strong>{name}</strong>;
  }
});

// 2)
var WelcomeBox = React.createClass({
  render: function () {
    return (
      <div>
        <h1>Hello, <User name={this.props.name} />!</h1>
        <p>Welcome to this site!</p>
      </div>
    );
  }
});

// 3) Render on document.getElementById('result')
React.render(<WelcomeBox name="Username" />, el);

// Tests should turn green
var expect = chai.expect;
describe('workshop part 1', function () {
  it('should have class named User and WelcomeBox', function () {
    expect(React.isValidClass(User)).to.equal(true);
    expect(React.isValidClass(WelcomeBox)).to.equal(true);
  });

  it('should have WelcomeBox component', function () {
    var output = React.renderComponentToString(WelcomeBox({ name: 'Foobar'}));
    expect(output).to.contain('<div');
    expect(output).to.contain('<strong');
    expect(output).to.contain('Foobar');
    expect(output).to.contain('<h1');
  });

  it('should have User component', function () {
    var output = React.renderComponentToString(User({ name: 'Foobar' }));
    expect(output).to.contain('Foobar');
    expect(output).to.contain('<strong');
  });

  it('should have rendered component', function () {
    var html = document.querySelector('#result').innerText;
    expect(html).to.contain('Hello, Username!');
  });
});
