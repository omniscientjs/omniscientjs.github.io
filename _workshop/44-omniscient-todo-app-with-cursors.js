---
layout: workshop
collection: workshop
title: Make a simple TODO app With Cursors
section: 3
name: 44-omniscient-todo-app-with-cursors
next: 36
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

var Item = component('Item', function ({item}) {
  var onChecked = () => item.update('checked', state => !state);
  var style = {
    textDecoration: item.get('checked') ? 'line-through' : 'none',
  };
  return (
    <li>
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
