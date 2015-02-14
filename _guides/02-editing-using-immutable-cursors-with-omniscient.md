---
layout: guides
collection: guides
title: Editing Using Immutable Cursors with Omniscient
name: 02-editing-using-immutable-cursors-with-omniscient
prev: 01-simpler-ui-reasoning-with-unidirectional
---

This is a small writeup on how to use [Immutable.js](https://github.com/facebook/immutable-js) and [immstruct](https://github.com/omniscientjs/immstruct). It's not strictly a Omniscient specific guide, but immstruct is often used with Omniscient and works great with it.

You often see the following usage:

```js
var App = component(function (props) {
   var change = function () {
      props.cursor.update(function () { return 'Hello'; });
   };
   return <button onClick={change}>{props.cursor.deref()}</button>
});

var structure = immstruct({ message: 'Foo' });

function render () {
   React.render(<App.jsx cursor={structure.cursor('message')} />, document.body);
}

structure.on('swap', render);
render();
```

What is really happening with `props.cursor.update()`?

when you do

```js
props.cursor.update(function () { return 'Hello'; });
```

An event (`swap`) is triggered in immstruct, and with Omniscient and React, you render the entire structure again, with:

```js
function render () {
   React.render(<App.jsx cursor={structure.cursor('message')} />, document.body);
}

structure.on('swap', render);
```

So we see, actually, with Omniscient we get passed a new cursor. They are immutable. But if, however, you try to use the cursor twice in a Omniscient component, like so:

```js
var App = component(function (props) {
   var change = function () {
      props.cursor.update(function (current) { return current + 'Hello'; });
      props.cursor.update(function (current) { return current + 'Bye'; });
   };
   return <button onClick={change}>{props.cursor.deref()}</button>
});
```

You first will update the structure to have `FooHello`, and then update to be `FooBye`. The result will be a button with the text `FooBye`, not `FooHelloBye` as you might expect. This is due to the immutability. Because you update the cursor in the same call stack. So the second time `props.cursor.update` is invoked, it is on the original cursor, not the cursor after the update on the line before. So what you would need to do, as they are immutable, is to store the previous cursor. Like so:

```js
var App = component(function (props) {
   var change = function () {
      var cursor = props.cursor.update(function (current) { return current + 'Hello'; });
      cursor.update(function (current) { return current + 'Bye'; });
   };
   return <button onClick={change}>{props.cursor.deref()}</button>
});
```

This will give the expected result `FooHelloBye`.

You can easily store the cursor and use it in the same stack. It will cause the render to happens multiple time, but you wouldn't loose data - as long as you take into consideration that cursors, as the structure, is immutable.

## A note on the structure

Having the following structure

```
var structure = immstruct({ message: 'Foo' });
```

And invoking `structure.cursor()`, you get a new cursor. `structure.cursor()` returns a new cursor based on the updated structure (reachable by doing `structure.current`). This is a method call for creating a new cursor, not a reference to an existing cursor, as `props.cursor.cursor('subpath')` would be. See examples below.

## Some examples

```js
// New cursor for top node, and update that value
structure.cursor().update(/* ... */);

// New cursor for top node, with the updated value from above
structure.cursor();


// new cursor again
var cursorReference = structure.cursor();
// cursorReference is now a cursor to the structure **when the cursor was created**.

var newCursorReference = cursorReference.update(/* .. */); // update structure referenced

cursorReference //=> Still a reference to the "old" data
newCursorReference //=> Reference to the new data
structure.cursor() //=> Reference to the new data (create a new cursor)
```

This is applicable when you do this on `structure`. The immstruct construct. If you have a cursor, it is a different story:

```js
// New sub cursor for top node, and update that value
var cursor = structure.cursor();

var subCursor = cursor.cursor(['some', 'place', 'in', 'tree']);

var newSubCursor = subCursor.update(/* ... */);

newSubCursor //=> new data
subCursor //=> old data

// and even:
cursor.cursor(['some', 'place', 'in', 'tree']) //=> old data

// this is due to:
cursor //=> old data
```