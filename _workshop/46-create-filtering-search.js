---
layout: workshop
collection: workshop
title: Create filtering search
section: 3
name: 46-create-filtering-search
slides: http://omniscientjs.github.io/workshop-talk
---

component = omniscient.withDefaults({ jsx: true });
component.debug();

var SearchBox = component('SearchBox', function ({search}) {
  function onChange (e) {
    // use the search cursor to update the value of 'query' inside the structure
    // to the value of the input from the event
    search.update('query', function (currentSearch) {
      return e.currentTarget.value;
    });
  }
  return <div>
    // create an input with the value of 'query' from the cursor
    // attach a listener to onChange that will update the query as you type
    <input placeholder="Search.." value={search.get('query')} onChange={onChange} />
  </div>;
});

var Match = component('Match', function ({lib}) {
  return <li>
    // render an anchor with the url of the library as the href attribute
    // and the title of the library as the content of the anchor tag
    <a href={lib.get('url')}>
      {lib.get('title')}
    </a>
  </li>;
});

var Matches = component('Matches', function ({search}) {
  var q = search.get('query'),
      libs = search.get('libs');

  // filter libs to only keep the libs whose title matches the query (hint: use indexOf())
  var matches = libs.filter(function (lib) {
    return lib.get('title').indexOf(q) !== -1 || lib.get('url').indexOf(q) !== -1;
  });

  return <ul>
    // map over matches.toArray() to render one Match component per library
    // passing a prop lib to the component
    {matches.toArray().map(function (lib) {
      return <Match key={lib.get('title')} lib={lib} />;
    })}
  </ul>;
});

var Search = component('Search', function ({search}) {
  return <div>
    // render a SearchBox component passing the search as a prop to the component
    <SearchBox search={search} />

    // render a Matches component passing the search as a prop to the compomnent
    <Matches search={search} />
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
