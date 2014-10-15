var component = require('omniscient');
var React = require('react');
var marked = require('marked');

var loadContentToCursor = require('../lib/loadContentToCursor');

var Header = require('./header');

module.exports = component(function (cursor) {
  var pageData = cursor.get('content');

  var content;
  if (!pageData) {
    loadContentToCursor(cursor.get('doc'), cursor);
    content = React.DOM.p(null, cursor.get('load-message'));
  } else {
    content = React.DOM.div({
      dangerouslySetInnerHTML: {
        __html:marked(pageData)
      }
    });
  }

  return React.DOM.div({}, content);
});
