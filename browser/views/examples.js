var React = require('react');
var component = require('omniscient');

var highlight = require('highlight.js');
var immstruct = require('immstruct');

var githubBaseUrl = require('../urls').examplesUrl;

var rerender = function () {
  var globalStructure = immstruct('global');
  globalStructure.forceHasSwapped();
};

var Header = require('./header');

var preventUpdateMixin = {
  shouldComponentUpdate: function (newProps, newState) {
    return false;
  }
};

var StructureView = component(preventUpdateMixin, function (cursor, statics) {
  if (!cursor) {
    return React.DOM.pre({ className: 'structure-preview' },
      React.DOM.code(null, 'No state')
    );
  }

  cursor = statics.structure.cursor();
  statics.structure && statics.structure.once('swap', function () {
    if (this.isMounted()) {
      this.forceUpdate();
    }
  }.bind(this));

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

var exampleMixin = {
  componentDidMount: function () {
    var node = this.getDOMNode().querySelector('.example-box');
    if (!node) return;
    this.props.cursor.get('init')(node);
  }
};

var Example = component([preventUpdateMixin, exampleMixin], function (example) {
  var structure = example.get('structure');
  var cursor = structure ? structure.cursor() : null;
  var name = example.get('name');
  var link = githubBaseUrl + name;

  var hideStructure = typeof example.get('showStructure') === 'boolean' && !example.get('showStructure');

  return React.DOM.div({ key: name },
    React.DOM.h2({ id: name },
      React.DOM.text(null, name),
      React.DOM.a({
        className: 'link-example',
        href: link
      }, 'Go to source')
    ),
    React.DOM.div({ className: 'example-container' },
      React.DOM.div({ className: 'example-wrapper cf' },
        React.DOM.div({ className: 'example-box ' + name }),
          StructureView(cursor, { structure: structure, hideStructure: hideStructure })
      )
    )
  );
});

module.exports = component(function (routeProps) {

  var examples = routeProps.cursor.cursor().get('examples').toArray().map(Example);

  return React.DOM.div({},
    Header(),

    React.DOM.div({ className: 'content-container' },
      examples
    )
  );
});
