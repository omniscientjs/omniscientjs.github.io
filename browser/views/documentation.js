var component = require('omniscient');
var React = require('react');

var Header = require('./header');
var marked = require('marked');

var loadContentToCursor = require('../lib/loadContentToCursor');

var doc = 'documentation';

module.exports = component(function (routeProps) {
  var structure = routeProps.cursor;
  var cursor = structure.cursor();
  var documentation = cursor.get('documentation');

  structure.once('swap', function () {
    if (this.isMounted()) {
      this.forceUpdate()
    }
  }.bind(this));

  var content;
  if (!documentation) {
    loadContentToCursor(doc, cursor);
    content = React.DOM.p(null, 'Loading documentation...');
  } else {
    content = React.DOM.div({
      dangerouslySetInnerHTML: {
        __html:marked(documentation)
      }
    });
  }

  return React.DOM.div({},
    Header(),
    React.DOM.div({ className: 'content-container' },
      content
    )
  );
});
