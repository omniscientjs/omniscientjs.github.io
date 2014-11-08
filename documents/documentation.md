Documentation
=========

Omniscient has a [very simple API](#api) only consisting of *one* function; `component`.

This function creates a wrapped React.js component to which you should pass a cursor of an immutable data structure needed for rendering a specific component, instead of the usual props.

Why cursors? Passing cursors of an immutable data structure down your component tree allows for components that can swap their own piece of data inside the immutable data structure when changes happen, that in turn will replace the whole of the outer data structure, but without each component actually needing knowledge about the rest of the structure. (Nobody actually wants a global data structure that everyone reaches into, right?)

You are able to listen for when this replacement happens, and make React re-render. Using immutable data structures with React in this way actually allows for super fast re-renders of the whole of your component tree, as references checks in shouldComponentUpdate will suffice for knowing if the components' data have changed, and determine if they need to re-render. This way, only component subtrees holding changed data will actually re-render.

## Installing

Omniscient strongly encourages the use of [npm](https://www.npmjs.org/) and [browserify](http://browserify.org/). There is no distributed compiled file, as the project has a dependency to [React](http://facebook.github.io/react/) and we don't want to bundle React or rely on global variables. You can of course [bundle your own standalone module](#build-standalone).

### Install from NPM

```sh
$ npm install --save omniscient
```

### Usage

When you have installed the library you can simply require it

```js
var component = require('omniscient'),
    React = require('react');

var Hello = component(function () {
  return React.DOM.h1({}, 'Hello, Omniscient!');
});
```

*See [more examples](/examples).*

### Compile and Use

Build your file using [browserify](http://browserify.org/). In the terminal do (customize with your directories):

```sh
$ browserify scripts/*.js > static/bundle.js
```

Then include `static/bundle.js` in your HTML.
```html
<script src="static/bundle.js"></script>
```

---

## API

```js
var Component = component([name, ][mixins, ]renderFunction);
Component([key: String, ]cursor: Cursor | Object<String, Cursor|Object|Statics>);

```
* `key` (*optional*) a key that is passed verbatim to the React component as `props.key` (e.g. for use in lists with repeating elements).
* `cursor` (*optional*) a cursor or an object literal holding cursors to part(s) of an immutable data structure, needed for your rendering your component, changes to any of these will trigger re-render. A **special property** statics is an *optional* object with static properties, does not cause a component to re-render on change.

E.g. pass a name-less cursor
```js
Component(immutableStructure.cursor());
// In component you can get cursor through props.cursor
```

E.g. passing a key, a single cursor and statics

```js
Component('keyPassedToReactComponent', {
  cursor: immutableStructure.cursor(),
  statics: { eventsFromChild: new EventEmitter() }
});
```

E.g. passing multiple cursors and statics

```js
Component({
  cursorOne: immutableStructure.cursor(),
  cursorTwo: immutableStructure.cursor(['somewhere', 'else']) },
  statics: { eventsFromChild: new EventEmitter() }
});
```

### Optional `name`

The optional argument `name` is used for debugging purposes, when `component.debug()` has been called.

### Optional `mixins`

The optional argument `mixins` is a list (or a single) object literal with methods passed directly to the React component as `mixins` . See [omniscient-mixins](https://github.com/omniscientjs/omniscient-mixins) for a set of useful, pre-defined mixins.

```js
var Logging = {
  safeLog: function (text) {
    console && console.log(text);
  }
};
var Component = component(Logging, function () {
  this.safeLog('Hello World!');
});
```


### Wrapped `renderFunction`

This is the component's render function that is passed off to React. The function is called with the following parameters.

```js
function (props[, statics]) { }
```

* `props` (*optional*) is a object literal holding cursors to the part(s) of the immutable data structure for the component. If you pass in a name-less cursor, the cursor is available through `props.cursor`.
* `statics` (*optional*) is an object of the received static values, that does not trigger a re-render when changed. You can also access the statics through the props or `this.props.statics`.

A component's passed `cursor` is also available on `this.props.cursor` for reach in mixins.

If multiple `cursors` were passed as part of an object literal, e.g.
```js
{
  cursorOne: immutableStructure.cursor(),
  cursorTwo: immutableStructure.cursor(['somewhere', 'else'])
}
```
all of these are available on `this.props`, as `this.props.cursorOne`and `this.props.cursorTwo` respectively. If you pass in a *name-less* cursor (i.e. invoked as `Component(cursor)`), the cursor is available as `this.props.cursor`.

`statics` are also available as `this.props.statics`.


### Debugging

```js
component.debug([regexPattern])
```

For debugging purposes, Omniscient supports calling `component.debug([regexPattern])`. This enables logging on calls to `render` and `shouldComponentUpdate`.

When debugging, you should give your component names. This way the output will be better traceable,
and you can filter on components using regex.

```js
var MyComponent = component('MyComponent', function () {
  return React.DOM.text({}, 'I output logging information on .shouldComponentUpdate() and .render()');
});

React.render(MyComponent('my-key'), document.body);
```

#### Filtering Debugging

The `component.debug` method takes an optional argument: `pattern`. This should be a regex
used for matching a component name or key. This allows you to filter on both component and
instance of component:


```js
component.debug(/mycomponent/i);

// or by key:
component.debug(/my\-key/);
```

Setting debug is a global change. If you want to be able to filter on multiple things and dig down
for finding errors, you can also use filtering in your browser inspector.


---

## Build Standalone

You can build omniscient as a standalone bundle by using `browserify`, but you would be required to supply the required dependencies yourself.

Clone the repository by doing

```
git clone https://github.com/omniscientjs/omniscient.git
```

Create a bundle using `browserify` and `derequire`.

```
$ cd omniscient
$ npm install -g derequire
$ browserify component.js --standalone Foo | derequire > omniscient.bundle.js
```
