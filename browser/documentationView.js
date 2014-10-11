var component = require('omniscient');
var React = require('react');

var Header = require('./headerView');
var marked = require('marked');

var loadContentToCursor = require('./lib/loadContentToCursor');

var doc = 'documentation';

module.exports = component(function (routeProps) {
  var cursor = routeProps.data.cursor();
  var documentation = cursor.get('documentation');

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
