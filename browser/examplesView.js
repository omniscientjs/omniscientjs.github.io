var component = require('omniscient');

var highlight = require('highlight.js');
var immstruct = require('immstruct');

var rerender = function () {
  var globalStructure = immstruct('global');
  globalStructure.forceHasSwapped();
};

var Header = require('./headerView');


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

module.exports = component(function (routeProps) {
  var examples = routeProps.data.cursor('examples').toArray().map(Example);

  return React.DOM.div({},
    Header(),

    React.DOM.div({ className: 'content-container' },
      examples
    )
  );
});
