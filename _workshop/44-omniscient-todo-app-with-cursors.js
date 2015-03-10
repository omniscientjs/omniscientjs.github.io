---
layout: workshop
collection: workshop
title: Make a simple TODO app With Cursors
section: 3
name: 44-omniscient-todo-app-with-cursors
next: 45-add-mixins-and-lifecycle-mixins
prev: 43-composing-omniscient-components
slides: http://omniscientjs.github.io/workshop-slides/#72
---

var component = omniscient.withDefaults({
  jsx: true
});

var data = immstruct({
  items: [
    { checked: true, text: 'Deadpool' },
    { checked: true, text: 'Wasp' },
    { checked: false, text: 'Iron Man' },
    { checked: true, text: 'Captain America' },
    { checked: true, text: 'Ant-Man' },
    { checked: false, text: 'Hulk' }
  ]
});

// Check your console to see omniscient's debug info for what needs
// to render as the immstruct structure change!
component.debug();


// Complete the Item component.
// Implement an onChecked method that will update the checked property of the item cursor to complete tasks.
// Completed items should be style with textDecoration 'line-through'.
var Item = component('Item', function ({item}) {

  return (
    <li>
      // Create a label with the correct styling.
      // The label should contain a checkbox that will complete the item when checked
      // and show the text of the item

    </li>
  );
});

var List = component('List', ({items}) =>
  <form>
    <h1>Todos</h1>
    <ul>
      // Map over the items cursor to create an Item component.
      // For each of the items in the cursor, pass item as a prop
      // to the component

    </ul>
  </form>);

render();
data.on('swap', render);

function render () {
  React.render(
    List({ items: data.cursor('items') }),
    el);
}
