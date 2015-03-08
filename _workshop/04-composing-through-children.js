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

// make an React Class named Item
// the component should show a <li> with the text passed as props as child
var Item = React.createClass({
  render: function () {
    return <li>{this.props.text}</li>;
  }
});

// make an React Class named List
// the component should show a <ul> with children passed as props
var List = React.createClass({
  render: function () {
    return (
      <ul>
        {this.props.children}
      </ul>
    );
  }
});

// make an React Class named App
// The component should show A <List> with four <Items> as children.
// The children should get passed list-items passed as props (e.g. `this.props.list[0]`)
var App = React.createClass({
  render: function () {
    return (
      <List>
        <Item text={this.props.list[0]} />
        <Item text={this.props.list[1]} />
        <Item text={this.props.list[2]} />
        <Item text={this.props.list[3]} />
      </List>
    );
  }
});


// render the App component to the `el` element
// with a prop list set to the list defined above
React.render(<App list={list} />, el);











/*  Tests are below here, for guiding you  */





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
    var html = el.innerText;
    expect(html).to.contain('React');
    expect(html).to.contain('Omniscient');
    expect(html).to.contain('Virtual-DOM');
  });
});

