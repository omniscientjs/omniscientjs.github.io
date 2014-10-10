var fs = require('fs');

var immstruct = require('immstruct');
var React = require('react');

var RRouter = require('rrouter'),
    Routes  = RRouter.Routes,
    Route   = RRouter.Route;

var structure = immstruct('global', {
  index: fs.readFileSync(__dirname + '/../index.md', 'utf-8'),

  examples: [
    require('../examples/entry-list'),
    require('../examples/events'),
    require('../examples/inline-edit')
  ]
});

var Index = require('./indexView');
var ExampleList = require('./examplesView');

var routes = Routes({},
  Route({ name: 'main', path: '/', view: Index, data: structure }),
  Route({ name: 'examples', path: '/examples', view: ExampleList, data: structure })
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
