var fs = require('fs');
var marked = require('marked');
var highlight = require('highlight.js');

var component = require('omniscient');
var immstruct = require('immstruct');
var React = require('react');

var RRouter = require('rrouter'),
    Routes  = RRouter.Routes,
    Route   = RRouter.Route,
    Link = RRouter.Link;


marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

var structure = immstruct({
  index: fs.readFileSync(__dirname + '/../index.md', 'utf-8'),

  examples: [
    require('../examples/entry-list'),
    require('../examples/events'),
    require('../examples/inline-edit')
  ]
});

var StructureView = component(function (cursor) {
  if (!cursor) {
    return React.DOM.p(null, 'No state');
  }

  var data = JSON.stringify(cursor.toJSON(), null, 2);


  return React.DOM.pre({ className: 'structure-preview' },
    React.DOM.code({
      className: 'lang-json',
      dangerouslySetInnerHTML: {
        __html: highlight.highlightAuto(JSON.stringify(cursor.toJSON())).value
      }
    })
  );
});


var Navigation = component(function () {
  return React.DOM.ul({},
              React.DOM.li({}, Link({ to: "/main"  }, "Home")),
              React.DOM.li({}, Link({ to: "/examples" }, "Examples")));
});

var Example = function (example) {
  var structure = example.get('structure');
  var cursor = structure ? structure.cursor() : null;
  if (structure) structure.once('swap', rerender);
  return React.DOM.div({ key: example.get('name') },
    example.get('component')(structure),
    StructureView(cursor)
  );
};

var ExampleList = component(function (routeProps) {
  var examples = routeProps.data.cursor('examples').toArray().map(Example);

  return React.DOM.div({},
    Navigation(),
    examples
  );
});

var Index = component(function (routeProps) {
  var cursor = routeProps.data.cursor();

  return React.DOM.div({},
    Navigation(),
    React.DOM.div({
      dangerouslySetInnerHTML: {
        __html:marked(cursor.get('index'))
      }
    })
  );
});

var routes = Routes({},
  Route({ name: 'main', path: '/', view: Index, data: structure }),
  Route({ name: 'examples', path: '/examples', view: ExampleList, data: structure })
);

var container = document.querySelector('.content-container');
var routing = RRouter.start(routes, function (view) {
  React.renderComponent(view, container);
});

// lister for change and redraw
structure.on('swap', rerender);
function rerender () {
  routing.update();
}
