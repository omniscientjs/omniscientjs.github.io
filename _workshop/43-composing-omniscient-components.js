---
layout: workshop
collection: workshop
title: Composing Omniscient Components
section: 3
name: 43-composing-omniscient-components
next: 44-omniscient-todo-app-with-cursors
prev: 42-hello-omniscient-jsx
slides: http://omniscientjs.github.io/workshop-slides/#71
---

var component = omniscient.withDefaults({ jsx: true });

var data = {
  items: [
    { checked: true, text: 'Deadpool' },
    { checked: true, text: 'Wasp' },
    { checked: false, text: 'Iron Man' },
    { checked: true, text: 'Captain America' },
    { checked: true, text: 'Ant-Man' },
    { checked: false, text: 'Hulk' }
  ]
};

// Create an Item component to render the item it is passed as a prop,
// completed items should be striked through by setting the style of the <li> that is returned.
// The contents of the li should be the text of each item
var Item = component('Item', function () {
  return <li></li>;
});

var List = component('List', () =>
  <div>
    <h1>Heroes used in slides</h1>
    <ul>
      // Map over items and render an Item component for each
      // passing a key and an item prop to the component

    </ul>
  </div>);


React.render(List(data), el);
