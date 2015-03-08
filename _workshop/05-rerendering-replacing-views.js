---
layout: workshop
collection: workshop
title: Re-rendering Functional Components
section: 1
name: 05-rerendering-replacing-views
prev: 04-composing-through-children
slides: http://omniscientjs.github.io/workshop-talk
---

var list = [
  { text: 'React' },
  { text: 'Virtual DOM' }
];


// make an React Class named List
// The component should show an <ul> with two <li>'s as children.
// The children should get passed list-items passed as child (e.g. `this.props.list[0]`)
var List = React.createClass({
  render: function () {
    return (
      <ul>
        <li>{this.props.list[0]}</li>
        <li>{this.props.list[1]}</li>
      </ul>
    );
  }
});


// render the List component to the `el` element
// with a prop list set to the list defined above
React.render(<List list={list} />, el);


// Do a setTimeout with 1 second timer which changes the
// first list item text to 'Immutable.js' instead of React.
// Then re-render the list with the new input.
setTimeout(function () {
  list[1].text = 'Immutable.js';
  React.render(<List list={list} />, el);
}, 1000);












/*  Tests are below here, for guiding you  */





describe('workshop part 1', function () {

  it('should have class named List', function () {
    expect(React.isValidClass(List)).to.equal(true,
      'List must be a valid React class');
  });

  it('should have component with list of input props', function () {
    var testList = [{ text: 'Custom Item' }];
    var output = React.renderComponentToString(List({ list: testList }));
    expect(output).to.contain('Custom Item');
    expect(output).to.contain('<li');
    expect(output).to.contain('<ul');
  });

  it('should have rendered components to DOM and change over time', function (done) {
    var html = el.innerText;
    expect(html).to.contain('React');
    expect(html).to.contain('Virtual DOM');

    // Ugly hack :(
    setTimeout(function () {
      html = el.innerText;
      expect(html).to.contain('Immutable.js');
      done();
    }, 1050);
  });
});


