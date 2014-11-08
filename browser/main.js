var fs = require('fs');

var immstruct = require('immstruct');
var React = require('react');

var highlight = require('highlight.js');
var marked = require('marked');

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

var Router = require('react-router');
var Route = React.createFactory(Router.Route);
var Routes = React.createFactory(Router.Routes);

var structure = immstruct('global', {
  pages: {
    'index':         { doc: 'index', 'load-message': 'Loading Omniscient introduction...', content: null },
    'documentation': { doc: 'documentation', 'load-message': 'Loading documentation...', content: null },
  },

  examples: [
    require('../examples/welcome'),
    require('../examples/entry-list'),
    require('../examples/events'),
    require('../examples/jsx-todo'),
    require('../examples/inline-edit'),
    require('../examples/search'),
    require('../examples/svg-eq')
  ]
});

var Index = require('./views/index');
var Documentation = require('./views/documentation');
var ExampleList = require('./views/examples');

var routes = Routes({ location: "history" },
  Route({ name: 'main', path: '/', handler: Index, cursor: structure }),
  Route({ name: 'examples', path: '/examples/', handler: ExampleList, cursor: structure }),
  Route({ name: 'documentation', path: '/documentation/', handler: Documentation, cursor: structure })
);

var container = document.querySelector('.page-container');
var rerender = function (view) {
  React.render(routes, container);
};

// lister for change and redraw
structure.on('swap', rerender);
rerender();
