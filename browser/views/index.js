var component = require('omniscient');
var React = require('react');

var Header = require('./header');

var marked = require('marked');

module.exports = component(function (routeProps) {
  var cursor = routeProps.cursor.cursor();

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
