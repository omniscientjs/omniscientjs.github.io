---
layout: guides
collection: api
title: Omniscient API Reference
name: 01-omniscient-api-reference
prev: 00-apis
next: 02-immstruct-api-reference
---

*API Reference for `Omniscient v3.0.1`*

More information can be found on the [Omniscient repo](https://github.com/omniscientjs/omniscient).

Given that:

```jsx
var component = require('omniscient');
```

## `component([displayName, ][mixins, ]function (props, statics) { })`

The API of Omniscient is pretty simple, you create a component with a render function, and mixins if you need them. When using the created component, you can pass a cursor or an object as data to the component. If you simply pass a cursor, the cursor will be accessible on the `props.cursor` accessor. This data will be accessible in the render function of the component (as props). In the passed data object, if it's within the `statics` property, the changes won't get tracker (see below).

### Parameter Setup

```jsx
var MyComponent = component([displayName, ][mixins, ]function (props, statics) { });
MyComponent([key: String, ](Object: data | Cursor));
```

### Examples

```jsx
// Create component with display name MyComponentName
var MyComponent = component(function MyComponentName (props) {
  return (<div>Hello {props.cursor.get('name')}</div>);
});
React.render(MyComponent(myCursor), document.body);
```

Without cursor

```jsx
var MyComponent = component(function MyComponentName (props) {
  return (<div>Hello {props.name}</div>);
});
React.render(MyComponent({ name: 'Omniscient'), document.body);
```

As JSX

```jsx
var MyComponent = component(function MyComponentName (props) {
  return (<div>Hello {props.name}</div>);
}).jsx; // notice jsx
React.render(<MyComponent name={'Omniscient'} />, document.body);
```

With mixins:

```jsx
var myMixins = {
  componentDidMount: function () {
     // do something
  },
  componentDidUnmount: function () {
     // do something else
  }
};
var MyComponent = component(myMixins, function MyComponentName (props) {
  return (<div>Hello {props.name}</div>);
}).jsx; // notice jsx
React.render(<MyComponent name={'Omniscient'} />, document.body);
```

With multiple mixins (compositions):

```jsx
var someMixins = {
  componentDidMount: function () {
     // do something
  },
  componentDidUnmount: function () {
     // do something else
  }
};
var otherMixins = {
  doSomething: function (input) {
     // do something with input foo
  }
};

var mixins = [someMixins].concat(otherMixins);
var MyComponent = component(mixins, function MyComponentName (props) {
  this.doSomething('foo');
  return (<div>Hello {props.name}</div>);
}).jsx; // notice jsx
React.render(<MyComponent name={'Omniscient'} />, document.body);
```

#### With ES2015 syntax

```jsx
// Create component with display name MyComponentName
var MyComponent = component('MyComponentName', ({name}) => (<div>Hello {name}</div>));
React.render(<MyComponent name={'Omniscient'} />, document.body);
```

*Notice: As we can't use a named function, we can define component name as first argument.*

## `component.debug()`

Activate debugging. Debug when a component is rendered, and the decision of `shouldComponentUpdate`.


## `component.debug(pattern)`

Activate debugging. Pattern is a Regular Expression. Only log messages which matches passed regex.

### Example

Only show debug statements for components with key or name `MyComponent`.

```jsx
component.debug(/MyComponent/i)
```

## `component.debug(logFunction)`
Activate debug, and define how to log messages. Log all messages (do not filter on any regex.)

### Example

```jsx
component.debug(function (debugMessage) {
  saveMessageToFile(debugMessage);
});
```


## `component.debug(pattern, logFunction)`
Activate debug, for messages matching passed regex pattern and pass log message to `logFunction` instead of logging to `console.debug`.

### Example

```jsx
component.debug(/MyComponent/i, function (debugMessage) {
  saveMessageToFile(debugMessage);
});
```

## `component.shouldComponentUpdate`

This is the mixin used to determine if a component should update or not. If you like the architectural concept of Omniscient, but not the syntactic sugar, you can override the `shouldComponentUpdate` of your vanilla React component with this mixin, and you can use cursors!

You can also directly require the mixin, to save bytes in your source code:

```jsx
var shouldComponentUpdate = require('omniscient/shouldupdate');
```

### Example

Through omniscient:

```jsx
var shouldComponentUpdate = require('omniscient').shouldComponentUpdate;

var MyComponent = React.createClass({
   mixins: [{ shouldComponentUpdate: shouldComponentUpdate }],
  render: function () { /* your render function */ }
```

Requiring directly

```jsx
var shouldComponentUpdate = require('omniscient/shouldupdate');

var MyComponent = React.createClass({
   mixins: [{ shouldComponentUpdate: shouldComponentUpdate }],
  render: function () { /* your render function */ }
```


## `component.withDefaults([Object: defaults])`

You can create a "local" instance of the Omniscient component creator by using the `.withDefaults` methods. This also allows you to override any defaults that Omniscient uses to check equality of objects, unwrap cursors, etc. See below on section about defaults for what to override.

### "Sandboxed" component Example

```jsx
var component = require('omniscient');

// Create a local component factory with "normal" defaults
var localComponent = component.withDefaults();
localComponent.foo = 'foo';

assert(localComponent.foo !== component.foo);
```

**You can use all the functions on local `omniscient` instances as you can on regular instances**


### Omniscient Defaults

This is an overview of all properties that can be overridden in Omniscient. All properties are functions that have default implementations, and can be overwritten (just for the local component which is returned).

```jsx
var component = require('omniscient');

var localComponent = component.withDefaults({
  // Goes directly to component
  shouldComponentUpdate: function(nextProps, nextState), // check update
  jsx: false, // whether or not to default to jsx components
  cursorField: '__singleCursor', // cursor property name to "unwrap" before passing in to render (see note)

  // Is passed on to `shouldComponentUpdate`
  isCursor: function(cursor), // check if is props
  isEqualCursor: function (oneCursor, otherCursor), // check cursor
  isEqualState: function (currentState, nextState), // check state
  isImmutable: function (currentState, nextState), // check if object is immutable
  isEqualProps: function (currentProps, nextProps), // check props
  unCursor: function (cursor) // convert from cursor to object
});
```

`cursorField` defines if a cursor should be unwrapped before sending it into
the render function. Example:

```jsx
var localComponent = component.withDefaults({
  cursorField: 'foobar'
});

var Component = component(function(myPassedCursor) {
  // Now you have myPassedCursor instead of having to do props.foobar
});

React.render(<Component foobar={myCursor} />, document.body)
```

## `shouldComponentUpdate.withDefaults([Object: defaults])`

As with the component creator, you can create local instances of `shouldComponentUpdate` with overwritten defaults. Actually, most functions you can override on `component` object, is just passed on to `shouldComponentUpdate`.

This is a complete overview of the defaults you can override on `shouldComponentUpdate`:

```jsx
var shouldComponentUpdate = require('omniscient/shouldupdate');

var localShouldUpdate = shouldComponentUpdate.withDefaults({
  isCursor: function(cursor), // check if is props
  isEqualCursor: function (oneCursor, otherCursor), // check cursor
  isEqualState: function (currentState, nextState), // check state
  isImmutable: function (currentState, nextState), // check if object is immutable
  isEqualProps: function (currentProps, nextProps), // check props
  unCursor: function (cursor) // convert from cursor to object
});

```