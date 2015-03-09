---
layout: workshop
collection: workshop
title: Composing Components Through Children
section: 1
name: 04-composing-through-children
next: 06-render-two-times
prev: 03-composing-components
slides: http://omniscientjs.github.io/workshop-slides/#15
---

var list = [
  { text: 'React' },
  { text: 'Omniscient' },
  { text: 'Virtual-DOM' },
  { text: 'Immutable.js' }
];

// Make a React Class named Item
// the component should show a <li> with the text passed as props as child
var Item ;

// Make a React Class named List
// the component should show a <ul> with children passed as props
var List;

// Make a React Class named App
// The component should show A <List> with four <Items> as children.
// The children should get passed list-items passed as props (e.g. `this.props.list[0]`)
var App;


// Render the App component to the `el` element
// with a prop list set to the list defined above











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

