---
layout: guides
collection: guides
title: Simpler UI Reasoning with Unidirectional Dataflow and Immutable Data
name: 01-simpler-ui-reasoning-with-unidirectional
prev: 00-all-guides
next: 02-immutable-data-cursors-and-omniscient
date: October 27, 2014
---

_This article was originally posted on [open.bekk.no](http://open.bekk.no/easier-reasoning-with-unidirectional-dataflow-and-immutable-data)_


In this post we'll explore the thoughts behind the architecture of having small reusable components inspired by functional programming. Combine this with immutable data and we can create blazing fast, easy to understand, declarative set of views.

Making software is hard, in most cases due to state. State can be in flux, changing as result of interactions, external factors or simply state for the sake of state. State makes it hard to reason about a piece of code, as something outside the code can have indirect or even implicit control of the behaviour of the code. If this is the case, you can't simply read a piece of code and intuitively understand what this code does. Even worse, the same piece of code can give a different output the next time you execute it – even though the code never changed and the input is the same. This makes it hard to rely on the given piece of code.

Functional programming has the concept of pure functions, which can help us remove this issue. A function is pure if it has no effects outside of its own body. In other words, no side-effects. A function defined as `(x) => x*2` is an example of a pure function. The value of input `x` is never changed, but a new result derived from `x` is returned. If we pass `2` as input for this lambda, we get `4` as output, while the value of `x` remains `2`. Every time. Pure functions can also have referential transparency, meaning that it will always produce the same output given the same input. You can [read more about pure functions and why we should be inspired by them here](http://www.drdobbs.com/architecture-and-design/pure-functions/228700129).

In web development we are constantly working in a stateful and side-effectful environment; the browser. The DOM is a big piece of state, and managing this can be a hassle. Especially when doing it in an asynchronous fashion. This is why we need to abstract the handling of the DOM, to make it easier to reason about how our application will be rendered. We should be able to look at the code producing the visual representation and easily know how the resulting DOM structure and which changes will be neccessary to realise it. This sounds like something pure, referentially transparent functions can help us with; *Let us introduce the concept of components*.

## Components

A component is a small piece of the user interface of our application, a view, that can be composed with other components to make more advanced components. Components can have components as parents and/or components as children, much like the HTML-elements we know and love. A component-producing function is pure and referentially transparent. Given input to a component-function, it will always produce the same output component. Take for instance a component with a header element with some text-content. This component can be produced by calling a component-function with some input. This input becomes the text content of the header. The component-function will produce the exact same component given the same input. If we want to make a change to the resulting component we will need to swap it out with a component produced by calling the component-function with some other input. This might look something like this:

```jsx
var Header = component(function (data) {
  // First argument is h1 metadata
  return h1(null, data.text);
});

// Render the component to our DOM
render(Header({text: 'Hello'}), document.body);

// Some time later, we change it, by calling the
// component once more.
setTimeout(function () {
  render(Header({text: 'Changed'}), document.body);
}, 1000);
```

We can see, by the pseudocode above, that we have a h1-element with a given text. By calling `render` we attach this component into the document body in the DOM. After 1 second, we call render again, but this time with a different input to the component-function. The call to `render` will replace the contents of the document body with the new component. We now have a very easy to reason about rendering situation. We produce components with pure, referentially transparent functions and through some magic in a render-function attach the components to the DOM. The `render` function is the abstraction of the DOM manipulation, so the component-function does not need to manipulate the DOM itself. This also means that we do not need to keep state in the component-functions.

Another thing we can more easily achieve with this component system, is single responsibility. We can easily create small components, which are easily composed because they are stateless and side-effect free, and through that achieve reusable code. We could easily have two different headers using the header component-function defined above:

```jsx
var hello = Header({ text: 'Hello' });
var bye   = Header({ text: 'Good Bye' });
```

We can compose `Header` with another component, `Welcome`, by using `Header` as a child-component of `Welcome`.

```jsx
var Welcome = component(function (data) {
  return div(null, Header({ text: 'Hello, ' + data.user }));
});

render(Welcome({ user: 'Dr. Brown' }), document.body);
```

The component `Welcome`, now consists of another component. We've composed them. The composed component is still pure, referentially transparent, and stateless. All the side-effects are still done solely by the render-function. Using components, and composing them, we can represent our entire user interface as a stateless, side-effect free, and referentially transparent function. This is incredibly easy to reason about!

But, being without side-effects, what good is our interface if the users can't effect it? They want to do operations like clicking buttons and enter text. We need some way to execute operations and functions and have them reflected in our components. Take for instance some action occuring in case a button is clicked, we could handle this internally in the component like so:

```jsx
var Button = component(function () {
  var clickHandler = function () {
    console.log('Clicked!');
  };

  return button({ onClick: clickHandler }, 'Button')
});
```

This works for the simple case where all the state that needs to change can be kept contained within the component. However, with more complexity we will need to call the render function again, which will require us to affect state outside the component. This violates the invariant that components should be free of side-effects. We'll now look into how we can delegate this side-effect.

## Immutable Components

Immutability is another concept the functional paradigm relies on. When a new value is set, the previous value isn't mutated, it still exist. Immutable objects always returns new objects with updated values, instead of the original object with a different value. This is truly useful in changing environments where we have async code, or even threads. If we have a reference to an object, this cannot change by a side-effect by some other part of the system.

```jsx
let arr  = Object.freeze([1, 2, 3]);
let arr2 = arr.map(x => x * 2);

firstItem(arr);  //=> 1
firstItem(arr2); //=> 2
```

As another major gain, using immutable objects, we can have easier checks if value has changed. We can do a simple object reference check instead of checking values. It is a simple check of *is this reference, a reference to the __same object__ as this reference?*. This is a **really** fast operation to do. We don't have to iterate over an object and check each key and value (possibly even nested). Another gain is that we can always have a history, as values are never mutated or changed. We can have a storage of previous instances of objects. This could take up more memory, but we can be smart about how we store large immutable structures and have data sharing in revision trees. There is more information about immutable object in [this Wikipedia-page](http://en.wikipedia.org/wiki/Immutable_object), for those interested.

By introducing our components to immutable data structures we can have one top all-knowing structure holding the entire application or module data information, and have our components reflect this information – declaratively. We can pass a part of the immutable structure to a specific component, so that component only have information about its relevant information, not information it doesn't need to know. Separation of concern, divide and conquer.

```jsx
// Create a immutable object
var info = deepFreeze({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Dr. Brown' }
});

var User = component(function (user) {
  // only access to user information
  return text(null, 'Username: ' + user.name);
});

var Header = component(function (site) {
  // only access to site information
  return h1(null, site.title);
});

var App = component(function (info) {
  return div(null,
    Header(info.site),
    User(info.user));
});

render(App(info), document.body);
```

We see that the two sub-components, `User` and `Header`, don't have any knowledge to each other or the information they possess. They are only concerned about themselves and the information they possess. This is really good for reducing complexity and dividing problems, but if we have a immutable state on the top and change it, how can we re-render it?

As we have pure functions, we can swap out the entire immutable structure on the top, and do a re-render.

```jsx
// Create a new top structure
info = deepFreeze({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Doc' }
});

// re-render again, showing the changed username
render(App(info), document.body);
```

But that would cause our entire app to re-render, but we would have to do much data repetition and it would be fairly slow. There is however, a concept called **cursors**. Cursors are simply pointers to a subset of data in a immutable structure. So if we update the data a cursor is pointing to, we get a new immutable structure where only the changed data is different, all other parts of the structure is the same, with the same reference. For instance:

```jsx
// Note: This is not a real implementation, but a conceptual
// idea.

var structure = immutable({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Dr. Brown' }
});

// Make a cursor to structure.user.name and create a new
// structure with the swapped data.
var newStructure = structure.cursor(['user', 'name']).update('Doc');

(structure.site === newStructure.site) //=> true
(structure.user === newStructure.user) //=> false

structure.user    //=> 'Dr. Brown'
newStructure.user //=> 'Doc'
```

We can use this to be smarter about what we want to re-render. Instead of passing the actual data into components and sub-components, we pass on cursors to these values. Components have a function deciding whether to re-render, simply based on if the newly passed cursor points to the same value as the previous passed cursor. If the data hasn't change, there shouldn't be any need of re-rendering. Remember, as this is a simple object reference check, it is lightning fast.

```jsx
// Note: This is not a real implementation, but a conceptual
// idea.

// Create a immutable object
var structure = immutable({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Dr. Brown' }
});

var User = component(function (cursor) {
  // only access to user information
  return text(null, 'Username: ' + cursor.get('name'));
});

var Header = component(function (cursor) {
  // only access to site information
  return h1(null, cursor.get('title'));
});

var App = component(function (cursor) {
  return div(null,
    // A sub-cursor to the `site` part of the structure
    Header(cursor.cursor('site')),
    // A sub-cursor to the `user` part of the structure
    User(cursor.cursor('user'));
});

// Get a cursor for the entire structure
render(App(structure.cursor()), document.body);

// Swap a value using the cursor
structure = structure.cursor(['user', 'name']).update('Doc');
render(App(structure.cursor()), document.body);
```

This would prevent `Header` from re-rendering, as the cursor passed to `Header` points to the same, unchanged, data on both render iterations.

## Code Reuse and Shareability

We can often have a set of operations that different components can rely on. Operations that are generic enough so two different components can have the same implementation, but we wouldn't want to copy this code or having those components share state in any way. To solve this, we can use mixins. Components can have one or more *attached* functions that we can call internally, the so-called mixins. This way, we can compose different sets of mixins and share mixins across components, attaching the "reusable operations" to each component. Same implementation, but not any shared context.

```jsx
var clickMixins = {
  clickHandler: function () {
    console.log('Clicked!');
  }
};

// Use mixin with clickHandler
var Button = component(clickMixins, function () {
  return button({ onClick: this.clickHandler }, 'Button')
});

// Also uses mixin with clickHandler
var Text = component(clickMixins, function () {
  return text({ onClick: this.clickHandler }, 'Button')
});
```

A component can get more than one set of mixins, as well.

```jsx
var clickMixins = {
  clickHandler: function () {
    this.safeLog('Clicked!');
  },

  safeLog: function (message) {
    console && console.log(message);
  }
};

var onRendering = {
  // Called when component is loaded first time
  componentDidMount: function (message) {
    alert('Noisy component alerts.');
  }
};

// Use both sets of mixins
var Button = component([clickMixins, onRendering], function () {
  return button({ onClick: this.clickHandler }, 'Button')
});
```

## Omniscient + React.js

What we have seen now isn't necessarily implementation specific but more of a design and thought pattern, but for many of you, part of the code might seem familiar. We can use a combination of the libraries [React](https://github.com/facebook/react), [Omniscient.js](https://github.com/omniscientjs/omniscient), and [Immutable.js](https://github.com/facebook/immutable-js) to achieve architecture and application flow.

React.js is a library maintained and created by developers at Facebook. The key takeaway from React.js: it's just concerned about the UI, it uses a Virtual DOM and smart algorithms for minimising slow DOM operations and manipulations. It only actually changes the DOM if there is a change from the Virtual DOM. On top of React.js, we can use Omniscient.js. Omniscient is a small library that builds on the ideas from this article, having small composable components with top-down rendering. Combine this with the cursors and immutable data structures of Immutable.js, and we can achieve a really good implementation of the architectural concepts we've discussed.

```jsx
var React     = require('react'),
    Immutable = require('immutable'),
    Cursor = require('immutable/contrib/cursor'),
    component = require('omniscient');

var structure = Immutable.fromJS({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Dr. Brown' }
});

// Minor change in syntax, we get cursors through properties.
var User = component(function (cursor) {
  return React.DOM.text(null, 'Username: ' + cursor.get('name'));
});

var Header = component(function (cursor) {
  return React.DOM.h1(null, cursor.get('title'));
});

var App = component(function (cursor) {
  return React.DOM.div(null,
    Header(cursor.cursor('site')),
    User(cursor.cursor('user'));
});

// Pass on a cursor to the entire structure
React.render(App(Cursor.from(structure, [])), document.body);

// Swap the user.name value
structure = Cursor.from(structure, ['user', 'name']).update(function () {
  return 'Doc';
});

// Pass on a cursor to the entire structure again (new cursor)
React.render(App(Cursor.from(structure, [])), document.body);
```

If we combine the Virtual DOM diff-ing of React, the object reference checks of immutable data and the thought pattern of Omniscient, we get a really fast top-down rendering with only representing state in the top of our modules or application.

In the case of the example above, the `App` component will have changed data, as one of its children is changed, but the React DOM diff will see that the HTML-element itself hasn't changed so it won't actually manipulate the DOM. And the `Header` component won't even check to see if the DOM has changed, as the data it is being passed hasn't changed at all.

This looks pretty good. We can easily reason with the application flow, it feels like regular markup, just in Javascript. We can have small reusable components with sharable mixins, and we won't have to handle the DOM at all – and it is really fast. Best of all, we can store the application state at the top, and given that structure the application will always turn out the same. We could even store the current state and pick it up from here after a refresh or even a server restart. This is pretty awesome for testing and developing as well.

However, this relies on always changing the structure on the top, but this is often not the case. Actually, we're usually far down in a sub-component tree when we want to make changes; like deleting a comment in a list of comments in a list of posts in a site. We want to be able to swap values somewhere down in the structure and do a re-render from top-down. To handle this, we can add a new dependency called [immstruct](https://github.com/omniscientjs/immstruct).

Immstruct is the last piece of the puzzle. It is a minimized wrapper for [Immutable.js](https://github.com/facebook/immutable-js), which allows us to get an event when a value has been swapped in the immutable structure. In addition, we can easily create and re-retrieve a structure through keys - allowing us to access a structure from different modules. Let's see how we would update the username by clicking it, following our previous example.

```jsx
var React     = require('react'),
    // Swap out Immutable.js with immstruct
    immstruct = require('immstruct'),
    component = require('omniscient');

// Create new wrapped structure. Returns an event emitter
var structure = immstruct({
  site: { title: 'Biff\'s Spare Parts - Online' },
  user: { name: 'Dr. Brown' }
});

var mixins = {
  clickHandler: function () {
    // get the cursor from `this`
    this.props.cursor.update('name', function () {
      return 'Doc';
    });
  }
};

var User = component(mixins, function (props) {
  return React.DOM.text({ onClick: this.clickHandler }, 'Username: ' + props.cursor.get('name'));
});

var Header = component(/** same as before */);
var App = component(/** same as before */);

function render() {
  React.render(
    App(structure.cursor()),
    document.body
  );
}

// Render & Listen for when a new structure is created
render();
// This is the important part:
structure.on('swap', render);
```

As we see, we can swap values by updating the value the cursor is pointing at, from a sub-component, and re-render the entire component tree – but it is blazing fast as it has object reference checks with immutable data and diff-ing from a virtual DOM.

## Object Reference Checking and the Virtual DOM

As mentioned, several times, when the top-down render is initiated, a reference check is done for each component (from top to bottom). Omniscient components has smart checks (the function `shouldComponentUpdate`) which is used by React to see if a component should be re-rendered or not. But in addition, if Omniscient says that the cursor refers to an object which has changed, React will still do a diff with the Virtual DOM and if the output doesn't change it won't do any DOM manipulation. So even if the reference check results in `true` for each of the parents of a sub-component when a sub-tree is swapped in a bigger immutable structure, it won't necessarily re-render on to the page – as its output doesn't change.

If we have the following application:

![Application flow](https://dl.dropboxusercontent.com/u/2361994/omniscient/app-structure.png)

And we change the `Header` node, we will not even check all the items as children of `List` as `List` has the same object reference as before. So the only thing we will change is the `Header`, and even though the `App` object reference has changed, it's output hasn't, so that won't trigger any DOM manipulations!

![Application flow](https://dl.dropboxusercontent.com/u/2361994/omniscient/app-title-change.png)

We see this even clearer if we try to change a specific item as a part of the list. We check if some of the other items have changed (through object reference checking of course), but only re-render the Item that has changed. `App` and `List` doesn't change it's output, and thus do any DOM operations.

![Application flow](https://dl.dropboxusercontent.com/u/2361994/omniscient/app-item-change.png)

## Closing Notes

This article has introduces some general concepts of web architecture and introduced a new way of doing UI using React and Omniscient with immutable data structures. The next part of this article-series is a basic example on how to [get started developing applications using Omniscient](http://omniscientjs.github.io/tutorials/01-editing-basic-tutorial-creating-list-with-live-filtering/). See more examples in the [Omniscient Playground](http://omniscientjs.github.io/playground/).

We've seen an architecture that is really easy to reason about. It has few building blocks and encourages small components to share between a project or event projects. This is only concerned with the UI and Views, and we should strive to have our components as focused as possible; not with logic and domain related code. By using tools from the functional paradigm, like pure functions and immutable structures, we can have a truly fast, consistant and testable front end architecture. More over, we don't have to be unsure how a component will render – given the same structure input we know it renders the same. And we don't have to handle the DOM manually and continually update it. We have declarative views in code, that is much faster and flexible to work with.
