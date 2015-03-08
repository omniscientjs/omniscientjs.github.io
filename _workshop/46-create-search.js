---
layout: workshop
collection: workshop
title: Create search
section: 3
name: 46-create-search
slides: http://omniscientjs.github.io/workshop-talk
---

component = omniscient.withDefaults({ jsx: true });
component.debug();

var SearchBox = component('SearchBox', function ({search}) {
  function onChange (e) {
    search.update('search', function (currentSearch) {
      return e.currentTarget.value;
    });
  }
  return <div>
    <input placeholder="Search.." value={search.get('search')} onChange={onChange} />
  </div>;
});

var Match = component('Match', function ({lib}) {
  return <li>
    <a href={lib.get('url')}>
      {lib.get('title')}
    </a>
  </li>;
});

var Matches = component('Matches', function ({search}) {
  var q = search.get('search');
  var libs = search.get('libs');
  var matches = libs.filter(function (lib) {
    return lib.get('title').indexOf(q) !== -1 || lib.get('url').indexOf(q) !== -1;
  });
  return <ul>
    {matches.toArray().map(function (lib) {
      return <Match key={lib.get('title')} lib={lib} />;
    })}
  </ul>;
});

var Search = component('Search', function ({search}) {
  return <div>
    <SearchBox search={search} />
    <Matches search={search} />
  </div>;
});

var structure = immstruct({
  search: "",
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
