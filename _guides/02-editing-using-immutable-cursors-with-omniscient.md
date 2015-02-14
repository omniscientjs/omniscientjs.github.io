---
layout: guides
collection: guides
title: Editing Using Immutable Cursors with Omniscient
name: 02-editing-using-immutable-cursors-with-omniscient
prev: 01-simpler-ui-reasoning-with-unidirectional
---

This is a small writeup on how to use [Immutable.js](https://github.com/facebook/immutable-js) and [immstruct](https://github.com/omniscientjs/immstruct). It's not strictly an Omniscient specific guide, but immstruct is often used with Omniscient, and works great with it.

You often see the following when immstruct is used with Omniscient:

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

When you do

```js
props.cursor.update(function () { return 'Hello'; });
```

A `swap` event is triggered in immstruct, and with Omniscient and React you render the entire structure again with:

```js
function render () {
   React.render(<App.jsx cursor={structure.cursor('message')} />, document.body);
}

structure.on('swap', render);
```

Here, Omniscient gets passed a new cursor to `message`. Cursors are immutable, so while you might attempt the following, it will probably not turn out the way you expected:

```js
var App = component(function (props) {
   var change = function () {
      props.cursor.update(function (current) { return current + 'Hello'; });
      props.cursor.update(function (current) { return current + 'Bye'; });
   };
   return <button onClick={change}>{props.cursor.deref()}</button>
});
```

This will first update the structure to contain `FooHello`, and then update it again to contain `FooBye`. The result will be a button with the text `FooBye`, not `FooHelloBye` as you might expect. This is because of immutability. Every cursor update returns a new cursor, containing the updated value. So the second time around when `props.cursor.update` is invoked, you are actually operating on the original cursor. To make this work, you need to keep the resulting cursor from the first `update` and update it with `'Bye'`:

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

Updating the structure twice will cause multiple renders, but you wouldn't loose data - as long as you take into consideration that both the underlying structure and the cursors are immutable.

## A note on the structure

Having the following structure

```
var structure = immstruct({ message: 'Foo' });
```

And invoking `structure.cursor()`, you get a new cursor based on the current structure (reachable by doing `structure.current`). Note that this is a method call for creating a new cursor, not a method for creating a cursor to a path of an existing cursor, like `props.cursor.cursor('subpath')` would be. 

## Some examples

```js
// New cursor for top node, and update that value to `someNewValue`
structure.cursor().update(/* .. */);

// New cursor for top node, containing the updated value from above
structure.cursor();

// New cursor again
var newCursor = structure.cursor();

var anotherCursor = newCursor.update(/* .. */); // update the structure again

newCursor          //=> Still points to the first updated data
anotherCursor      //=> Points to the updated data
structure.cursor() //=> Create another cursor that points to the updated data 
```

This is applicable when operating directly on a `structure`. If you have a cursor, it behaves slightly different:

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
