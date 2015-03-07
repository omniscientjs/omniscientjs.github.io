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

// 3) Render on el
React.render(<WelcomeBox name="The Doctor" />, el);

// Tests should turn green
describe('workshop part 1', function () {

  it('should have class named User and WelcomeBox', function () {
    expect(React.isValidClass(User)).to.equal(true,
      'User must be a valid React class');
    expect(React.isValidClass(WelcomeBox)).to.equal(true,
      'WelcomeBox must be a valid React class');
  });

  it('should have WelcomeBox component taking a name as props', function () {
    var output = React.renderComponentToString(WelcomeBox({ name: 'Foobar'}));
    expect(output).to.contain('<div', 'must be wrapped in a div');
    expect(output).to.contain('<strong', 'name should be wrapped in strong');
    expect(output).to.contain('Foobar', 'must render passed name');
    expect(output).to.contain('<h1', 'title should be h1');
  });

  it('should have User component taking name as props', function () {
    var output = React.renderComponentToString(User({ name: 'Foobar' }));
    expect(output).to.contain('Foobar', 'name should be overridable');
    expect(output).to.contain('<strong');
  });

  it('should have User component with default name John Smith', function () {
    var output = React.renderComponentToString(User());
    expect(output).to.contain('John Smith');
  });

  it('should have rendered components to DOM', function () {
    var html = el.innerText;
    expect(html).to.contain('Hello, The Doctor!');
  });
});
