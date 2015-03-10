---
layout: workshop
collection: workshop
title: Create filtering search
section: 3
name: 46-create-filtering-search
prev: 45-add-mixins-and-lifecycle-mixins
slides: http://omniscientjs.github.io/workshop-slides/#78
---

component = omniscient.withDefaults({ jsx: true });
component.debug();

var SearchBox = component('SearchBox', function ({search}) {
  function onChange (e) {
    // Use the search cursor to update the value of 'query' inside the structure
    // to the value of the input from the event
  }
  return <div>
    // Create an input with the value of 'query' from the cursor
    // attach a listener to onChange that will update the query as you type
  </div>;
});

// Complete the Match component.
// Render an anchor with the url of the library as the href attribute
// and the title of the library as the content of the anchor tag
var Match = component('Match', function ({lib}) {
  return <li></li>;
});

var Matches = component('Matches', function ({search}) {
  var q = search.get('query'),
      libs = search.get('libs');

  // Filter libs to only keep the libs whose title matches the query (hint: use indexOf())
  var matches;

  return <ul>
    // Map over matches.toArray() to render one Match component per library
    // passing a prop lib to the component
  </ul>;
});

var Search = component('Search', function ({search}) {
  return <div>
    <h1>Search</h1>
    // Render a SearchBox component passing the search as a prop to the component

    // Render a Matches component passing the search as a prop to the compomnent

  </div>;
});

var structure = immstruct({
  query: "",
  libs: [
    { title: "Backbone.js", url: "http://documentcloud.github.io/backbone/" },
    { title: "AngularJS", url: "https://angularjs.org/" },
    { title: "jQuery", url: "http://jquery.com/" },
    { title: "Prototype", url: "http://www.prototypejs.org/" },
    { title: "React", url: "http://facebook.github.io/react/" },
    { title: "Omniscient", url: "https://github.com/omniscientjs/omniscient" },
    { title: "Ember", url: "http://emberjs.com/" },
    { title: "Knockout.js", url: "http://knockoutjs.com/" },
    { title: "Dojo", url: "http://dojotoolkit.org/" },
    { title: "Mootools", url: "http://mootools.net/" },
    { title: "Underscore", url: "http://documentcloud.github.io/underscore/" },
    { title: "Lodash", url: "http://lodash.com/" },
    { title: "Moment", url: "http://momentjs.com/" },
    { title: "Express", url: "http://expressjs.com/" },
    { title: "Koa", url: "http://koajs.com" },
  ]
});

render();
structure.on('swap', render);

function render () {
  React.render(<Search search={structure.cursor()} />, el);
}
