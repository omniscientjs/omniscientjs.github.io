var fs = require('fs');
var marked = require('marked');
var highlight = require('highlight.js');

var component = require('omniscient');
var immstruct = require('immstruct');
var React = require('react');

var RRouter = require('rrouter'),
    Routes  = RRouter.Routes,
    Route   = RRouter.Route,
    Link    = RRouter.Link;

var logo = fs.readFileSync(__dirname + '/../assets/logo.svg', 'utf-8');

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


var Navigation = component(function () {
  return React.DOM.ul({},
              React.DOM.li({}, Link({ to: "/main"  }, "Home")),
              React.DOM.li({}, Link({ to: "/examples" }, "Examples")));
});

var Header = component(function (cursor) {
  return React.DOM.div({ className: 'header-container' },
    React.DOM.header(null,
      React.DOM.h1({ className: 'cf' },

        Link({ to: '/main', dangerouslySetInnerHTML: {
            __html: logo.toString()
          }
        })
      ),

      React.DOM.nav({ className: 'navigation' },
        Navigation(null)
      )
    )
  );
});

var StructureView = component(function (cursor) {
  if (!cursor) {
    return React.DOM.pre({ className: 'structure-preview' },
      React.DOM.code(null, 'No state')
    );
  }

  var data = JSON.stringify(cursor.toJSON(), null, 2);


  return React.DOM.pre({ className: 'structure-preview' },
    React.DOM.code({
      className: 'lang-json',
      dangerouslySetInnerHTML: {
        __html: highlight.highlightAuto(JSON.stringify(cursor.toJSON(), null, 2)).value
      }
    })
  );
});

var Example = function (example) {
  var structure = example.get('structure');
  var cursor = structure ? structure.cursor() : null;
  if (structure) structure.once('swap', rerender);
  return React.DOM.div({ key: example.get('name') },
    React.DOM.h2({}, example.get('name')),
    React.DOM.div({ className: 'example-container' },
      React.DOM.div({ className: 'example-wrapper cf' },
        StructureView(cursor),
        example.get('component')(structure)
      )
    )
  );
};

var ExampleList = component(function (routeProps) {
  var examples = routeProps.data.cursor('examples').toArray().map(Example);

  return React.DOM.div({},
    Header(),

    React.DOM.div({ className: 'content-container' },
      examples
    )
  );
});

var Index = component(function (routeProps) {
  var cursor = routeProps.data.cursor();

  return React.DOM.div({},
    Header(),
    React.DOM.div({ className: 'content-container' },
      React.DOM.div({
        dangerouslySetInnerHTML: {
          __html:marked(cursor.get('index'))
        }
      })
    )
  );
});

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
