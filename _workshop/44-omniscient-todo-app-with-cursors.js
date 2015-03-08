---
layout: workshop
collection: workshop
title: Make a simple TODO app With Cursors
section: 3
name: 44-omniscient-todo-app-with-cursors
next: 45-add-mixins-and-lifecycle-mixins
prev: 43-composing-omniscient-components
slides: http://omniscientjs.github.io/workshop-talk
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

// check your console to see omniscient's debug info for what needs
// to render as the immstruct structure change!
component.debug();


// complete the Item component
// implement an onChecked method that will update the checked property of the item cursor to complete tasks
// completed items should be style with textDecoration 'line-through'
var Item = component('Item', function ({item}) {
  var onChecked = () => item.update('checked', state => !state);
  var style = {
    textDecoration: item.get('checked') ? 'line-through' : 'none',
  };
  return (
    <li>
      // create a label with the correct styling
      // the label should contain a checkbox that will complete the item when checked
      // and show the text of the item
      <label style={style}>
        <input type="checkbox"
               onChange={onChecked}
               checked={item.get('checked')} />
         {item.get('text')}
      </label>
    </li>
  );
});

var List = component('List', ({items}) =>
  <form>
    <ul>
      // map over the items cursor to create an Item component
      // for each of the items in the cursor, pass item as a prop
      // to the component
      {items.toArray().map((item, i) =>
        <Item key={item.get('name')} item={item} />
      )}
    </ul>
  </form>);

render();
data.on('swap', render);

function render () {
  React.render(
    List({ items: data.cursor('items') }),
    el);
}
