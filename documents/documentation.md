Documentation
=========

Omniscient has a very simple API and only consist of *one* function; `component`.
This will create a wrapped React.js component in which you can pass a structure
cursor, instead of properties. This will allow for a top-down rendering of
immutable data structures. See function definition in the [api section](#api).

## Installing

Omniscient strongly encourages you to use [npm](https://www.npmjs.org/) and
[browserify](http://browserify.org/). There are no distributed compiled file,
as the project has a dependency to [React](http://facebook.github.io/react/)
and we wouldn't want to bundle React or simply rely on global variables. You
[can bundle your own standalone module](#build-standalone)
to use if you really want to.

### Install from NPM

```sh
$ npm install --save omniscient
```

### Usage

When you have installed the library you can simply require it

```js
var component = require('omniscient');
var React = require('react');

var Hello = component(function (cursor) {
  return React.DOM.h1({}, 'Hello, Omniscient!');
});
```
*See [more examples](/examples).*


### Compile and Use

Build your file using [browserify](http://browserify.org/). In the terminal do
(customize with your directories):

```sh
$ browserify scripts/*.js > static/bundle.js
```

Now you can include `static/bundle.js` in your HTML.

---

## API

```js
var Component = component([mixins, ]renderFunction);

Component([key, ]cursor[, statics]);

```
* Optional `key` can be a key that is passed to React component (e.g. in lists).
* `cursor` should be a reference to a part of a immutable structure
* Optional `statics` can be a object of static values that normally won't cause a
  component update if changed. Exception is the `shared` property that will cause a
  component update if it is changed.



Example with all values

```js
var key = 'keyPassedToReactComponent';
Component(key, immutableStructure.cursor(), {
  eventToChild: new EventEmitter()
  shared: {
    data: immutableStructure.cursor().get('sharedData')
  }
})

```
### Wrapped `renderFunction`

This is the render function that is passed to React with some modifications. The
function will have the following parameter list:

```js
function (cursor[, statics]) { }
```

* `cursor` is reference to a part of a immutable structure
* `statics` can be a object of static values that normally won't cause a
  component update if changed. Exception is the `shared` property that will cause a
  component update if it is changed.

### Optional `mixins`

Optional argument `mixins` is a list (or a single) object literal with methods
that is used as `mixins` to the component generated. See [omniscient-mixins](https://github.com/omniscientjs/omniscient-mixins)
for a set of pre-defined mixins that can be used.

```js
var Mixin = {
  safeLog: function (text) {
    console && console.log(text);
  }
};
var Component = component(Mixins, function () {
  this.safeLog('Hello World!');
});
```






---

## Build Standalone

You could make a standalone bundle by using `browserify`, but you would be required
to supply the dependencies yourself.

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
