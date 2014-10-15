var component = require('omniscient');
var React = require('react');
var Header = require('./header');

var Document = require('./document');

module.exports = component(function (routeProps) {
  var structure = routeProps.cursor;
  var cursor = structure.cursor(['pages', 'index']);

  structure.once('swap', function () {
    if (this.isMounted()) {
      this.forceUpdate()
    }
  }.bind(this));

  return React.DOM.div({},
    Header(),
    React.DOM.div({ className: 'content-container' },
      Document(cursor)
    )
  );
});
