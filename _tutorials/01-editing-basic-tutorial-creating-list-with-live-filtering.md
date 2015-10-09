---
layout: guides
collection: tutorials
title: Editing Basic Tutorial Creating List with Live Filtering
name: 01-editing-basic-tutorial-creating-list-with-live-filtering
prev: 00-all-tutorials
next: 02-editing-basic-tutorial-creating-list-with-live-filtering-jsx-edition

---

If you haven't read the Omniscient introduction article yet, you should probably [read it before you get started](/guides/01-simpler-ui-reasoning-with-unidirectional) on this tutorial. The previous article in this series introduces the concepts and architecture. In this example we will see how we can use [React](https://github.com/facebook/react), [Omniscient.js](https://github.com/omniscientjs/omniscient) and [Immutable.js](https://github.com/facebook/immutable-js) in a rudimentary search filtering of JavaScript libraries and frameworks. You can see a [running demo on the playground](http://omniscientjs.github.io/playground/02-search/). After we've implemented the example, we'll look into how we can debug an Omniscient application, and see which components get re-rendered.

For this example, we're creating a small application where we can search for different JavaScript libraries and frameworks. We should start by requiring the modules we want to use. A basic stack with Omniscient is React, immstruct and of course Omniscient (amd Immutable.js wrapped through immstruct).

```jsx
var React     = require('react'),
    immstruct = require('immstruct'),
    component = require('omniscient');
```

To show a list of different JavaScript projects, we should have a top structure with our data defined as a immutable structure. We are creating a list of different project and their URLs, but also an empty string with `search`. This will be the current search query, that we want as an active filter. The entire application state is defined in that structure alone. If we wanted, we could have started the application with a predefined search – making it easier to test and demo.

```jsx
var structure = immstruct({
  search: '',
  libs: [
    { title: 'Backbone.js', url: 'http://documentcloud.github.io/backbone/' },
    { title: 'AngularJS', url: 'https://angularjs.org/' },
    { title: 'jQuery', url: 'http://jquery.com/' },
    { title: 'Prototype', url: 'http://www.prototypejs.org/' },
    { title: 'React', url: 'http://facebook.github.io/react/' },
    { title: 'Omniscient', url: 'https://github.com/omniscientjs/omniscient' },
    { title: 'Ember', url: 'http://emberjs.com/' },
    { title: 'Knockout.js', url: 'http://knockoutjs.com/' },
    { title: 'Dojo', url: 'http://dojotoolkit.org/' },
    { title: 'Mootools', url: 'http://mootools.net/' },
    { title: 'Underscore', url: 'http://documentcloud.github.io/underscore/' },
    { title: 'Lodash', url: 'http://lodash.com/' },
    { title: 'Moment', url: 'http://momentjs.com/' },
    { title: 'Express', url: 'http://expressjs.com/' },
    { title: 'Koa', url: 'http://koajs.com' },
  ]
});
```

We could also load the data lazily. This is an operation that shouldn't be a part of our UI, but a separate module handling models and collections. We could send a cursor to where we want the data populated using Immutable.js. For instance:

```jsx
var storage = require('./storage');

var structure = immstruct({
  search: '',
  libs: [ ]
});

// This uses AJAX and swaps the empty libs list
// in our structure to a new one with the new models.
storage.fetchLibraries(structure.cursor('libs'));
```

There would't be any need for doing anything else. If our `fetchLibraries` method swapped the value in our structure, we would get an event from `immstruct` telling us that a value has been swapped in the data structure. We should re-render if this happens.

```jsx
render();
structure.on('swap', render);

function render () {
  React.render(
    Search(structure.cursor()),
    document.body
  );
}
```

Remember, `structure` is the immutable structure we created, and it emits an event, `swap`, using immstruct, when this event is emitted, we want to re-render the entire component tree, starting with a top parent component. We'll call it `Search` in this example.

Now we us start implementing `Search`, which will consist of a `SearchBox` and a set of `Matches`. This is pretty straight forward, we are simply making HTML elements and describing our view in a declarative way using components. Much like doing markup, but in JavaScript.

```jsx
var Search = component('Search', function (cursor) {
  return React.DOM.div({ },
              SearchBox(cursor.cursor('search')),
              Matches(cursor));
});
```

As we see, a component can be created by using Omniscient. The first argument is a string representation of the component and is used for debugging, as well as Component name for React. The second argument is the component implementation it self as a function. This function is a render function. When a component should render this function is executed, and its return value will be the presentation of this component. The render function of a component is passed a cursor, which is the cursor a parent component or the top renderer is serving. In our case we, `Search` will get passed an object literal with a property of our cursor to the entire application state through `structure.cursor()` as defined in our `render` function above.

As we can see, `Search` is a small component that only outputs a div with two sub-components; `SearchBox` and `Matches`. The empty object as first argument to the React div-element is HTML metadata to the div. We see that `Matches` gets the same cursor as `Search` has (a cursor to the entire structure), as it is a representation of the entire state, but the `SearchBox` only needs information about the search query. It should't concern it self with how the list is stored or handled.

The next natural step is to list out all the matches based on the search query - as is the main part of our application. We don't have any way of altering the search query yet, but that doesn't matter. We have the search query as a value inside our global application state, and with it being empty, we should list out all our JavaScript projects.

A list of matches in turn consist of a single `Match`. This will be a component that merely presents a JavaScript library as a list item with an anchor-element, like so:

```jsx
var Match = component('Match', function (cursor) {
  return d.li({}, d.a({ href: cursor.get('url') }, cursor.get('title')));
});
```

The `Matches` component is far more interesting, and is the heart of the application. We have to get the search query and all projects, and we have to filter the projects based on that query. The matches should be presented to the browser in an un-ordered list of elements.

```jsx
var Matches = component('Matches', function (cursor) {
  // Get the value from search query
  var q = cursor.get('search');

  // Get all projects
  var libs = cursor.get('libs');

  // Get all JavaScript projects that matches the query
  var matches = libs.filter(function (lib) {
    return lib.get('title').indexOf(q) !== -1 || lib.get('url').indexOf(q) !== -1;
  });

  // Present the matches
  return React.DOM.ul({}, matches.toArray().map(function (lib, i) {
    // Add key through first argument
    return Match('match-' + lib.get('title'), lib);
  }));
});
```

Even this, the main part of our application, shouldn't do anything that is not related to the presentation. We only want to present the items that match our search query, so we filter the list of libraries and only select those that contain our search query, either in the name or the URL. Now we actually have a working filterable list of JavaScript projects, we just don't have a way of filtering. But if we try to change our initial search query like so:

```jsx
var structure = immstruct({
  search: 'Omniscient',
  // ...
});
```

... and refresh the browser, we would see only Omniscient being presented in the list. And every time we refresh the browser, this is what we see. Pure, predictable components. But altering the source code and refreshing the browser isn't really user friendly - or fast. We should create a own separate component for updating the search query.

```jsx
var SearchBox = component('SearchBox', function (cursor) {
  return React.DOM.div({}, d.input({
    placeholder: "Search..",
    value: cursor.deref(),
    onChange: this.changeHandler
  }));
});
```

The `SearchBox` is easy, but we see two things here that might be new. The cursor we get passed is a cursor directly to the search string. This means that to get the string we need to de-reference the cursor by calling `cursor.deref()`. By having the value as the de-referenced cursor we have an input box with the search query text. Another thing here is the `changeHandler`. We have seen an event handler previously, but not `onChange`. `onChange` is triggered every time the input is changed (not blurred as one might expect).

We create a small mixin that can handle the change for us. As this is JavaScript and we can share a context with the component through `this`. The passed cursor is available through the property `this.props.cursor` inside the mixin, and the cursor points directly to the search query in the structure.

```jsx
var mixins = {
  changeHandler: function (e) {
    this.props.cursor.update(function (currentSearch) {
      return e.currentTarget.value;
    });
  }
};

// Change our SearchBox from above to add the mixins
var SearchBox = component('SearchBox', mixins, function (cursor) { /* same as before */ });

```

The `changeHandler` has one small job: update the cursor with the new value of the input box. This will swap the search query in the immutable structure and through an immstruct event tell the application to re-render. That is it. That is our entire live filter application. It is pretty awesome and really easy to reason about - almost as simple as HTML it self. But let's think a bit about what is happening here. What happens when we re-render, and how do we debug.

Check out the [complete source code in the Playground](http://omniscientjs.github.io/playground/02-search/).

### Analysing Re-renders

The re-render is interesting here. We will evaluate top-down and see if the components have changed. So when a new input is registered in our text field, we swap out the search query value in our structure and trigger a re-render. When the re-render happens, we see if the cursor passed to `Search` has changed, where we do:

```jsx
React.render(
  Search(structure.cursor()),
  document.body
);
```

It has changed, as a part of the object has changed. So we do a re-render. The component function is executed, and we check again if `SearchBox` and `Matches` have changed. Both have changed, as both have access to the search query, so we trigger a re-render on both of them. The search box simply renders out the new updated state to the browser, setting input value, whereas the `Matches` component generates a new list of sub-components, by filtering all JavaScript projects based on the search query.

If we activate the Omniscient debugger, we can see what happens next:

```jsx
// Activate debug-modus
component.debug();
```

While having the debug-mode activated, we try to go from `e` to `en` in the input box. We should get 4 results. The debug output is

```
<Search>: shouldComponentUpdate => true (props have changed)
<Search>: render
<SearchBox>: shouldComponentUpdate => true (props have changed)
<SearchBox>: render
<Matches>: shouldComponentUpdate => true (props have changed)
<Matches>: render
<Match key=match-Backbone.js>: shouldComponentUpdate => false
<Match key=match-Omniscient>: shouldComponentUpdate => false
<Match key=match-Underscore>: shouldComponentUpdate => false
<Match key=match-Moment>: shouldComponentUpdate => false
```

We see that all the parent components and the SearchBox are re-rendered. What is interesting is that none of the `Match` components are re-rendering. `Matches` re-renders, and removes several elements that don't match our query. The libraries that do match our query, are output, but they haven't changed, so they don't re-render - they just remain from the previous render.

If we remove a letter from the search query (making it `e` again), the debug-output for the `Match` component show:

```
<Match key=match-Backbone.js>: shouldComponentUpdate => false
<Match key=match-jQuery>: render
<Match key=match-Prototype>: render
<Match key=match-React>: render
<Match key=match-Omniscient>: shouldComponentUpdate => false
<Match key=match-Ember>: render
<Match key=match-Mootools>: render
<Match key=match-Underscore>: shouldComponentUpdate => false
<Match key=match-Moment>: shouldComponentUpdate => false
<Match key=match-Express>: render
```

We can see that all the components that matched the previous query are still unchanged, and only the new components get rendered.

## Summary

This has been an introductory tutorial for how we can use Omniscient and React to make applications. The application we created in this tutorial was fairly naïve and doesn't face the problems of real life. It is very rare we can have code as clean and small as this, but this shows, at the most basic level, how we can reason about a component based, top-down rendered, UI. It can be challenging at first, to switch out our "normal" way of designing JavaScript software, and having a loop that iterates every time we make a small change. It also might seem like this would be slow and un-optimized, but the smart implementation of React and the reference checks of Omniscient and Immutable.js will actually allow us to create fast, responsive, applications. You can see more examples and try them out live [in the Playground](http://omniscientjs.github.io/playground/).
