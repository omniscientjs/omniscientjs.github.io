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

var RRouter = require('rrouter'),
    Routes  = RRouter.Routes,
    Route   = RRouter.Route;

var structure = immstruct('global', {
  index: fs.readFileSync(__dirname + '/../documents/index.md', 'utf-8'),
  documentation: null,
  // install: null,

  examples: [
    require('../examples/intro'),
    require('../examples/entry-list'),
    require('../examples/events'),
    require('../examples/inline-edit')
  ]
});

var Index = require('./views/index');
var Documentation = require('./views/documentation');
var ExampleList = require('./views/examples');

var routes = Routes({},
  Route({ name: 'main', path: '/', view: Index, data: structure }),
  Route({ name: 'examples', path: '/examples', view: ExampleList, data: structure }),
  Route({ name: 'documentation', path: '/documentation', view: Documentation, data: structure })
);

var container = document.querySelector('.page-container');
var routing = RRouter.start(routes, function (view) {
  React.renderComponent(view, container);
});

// lister for change and redraw
structure.on('swap', rerender);
function rerender () {
  routing.update();
}
