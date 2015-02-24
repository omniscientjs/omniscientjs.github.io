---
layout: workshop
collection: workshop
title: Composing Components Through Children
section: 1
name: 04-composing-through-children
next: 05-rerendering-replacing-views
prev: 03-composing-components
slides: http://omniscientjs.github.io/workshop-talk
---

var list = [
  { text: 'React' },
  { text: 'Omniscient' },
  { text: 'Virtual-DOM' },
  { text: 'Immutable.js' }
];

// 1)
var Item = React.createClass({
  render: function () {
    return <li>{this.props.text}</li>;
  }
});

// 2)
var List = React.createClass({
  render: function () {
    return (
      <ul>
        {this.props.children}
      </ul>
    );
  }
});

// 3)
var App = React.createClass({
  render: function () {
    return (
      <List>
        {this.props.list.map(i => <Item text={i.text} />)}
      </List>
    );
  }
});

// 4) Render on document.getElementById('result')
React.render(<App list={list} />, el);

// Tests should turn green
var expect = chai.expect;
describe('workshop part 1', function () {
  it('should have class named App, List and Item', function () {
    expect(React.isValidClass(App)).to.equal(true,
      'App must be a valid React class');
    expect(React.isValidClass(List)).to.equal(true,
      'List must be a valid React class');
    expect(React.isValidClass(Item)).to.equal(true,
      'Item must be a valid React class');
  });

  it('should have component List and props with list', function () {
    var testList = [{ text: 'Custom Item' }];
    var output = React.renderComponentToString(App({ list: testList }));
    expect(output).to.contain('Custom Item');
    expect(output).to.contain('<li');
    expect(output).to.contain('<ul');
  });

  it('should have rendered components to DOM', function () {
    var html = document.querySelector('#result').innerText;
    expect(html).to.contain('React');
    expect(html).to.contain('Omniscient');
    expect(html).to.contain('Virtual-DOM');
  });
});