var component = require('omniscient');
var React = require('react');
var marked = require('marked');

var loadContentToCursor = require('../lib/loadContentToCursor');

var Header = require('./header');

var HashChange = {
  reloadHashChange: function () {
    setTimeout(function () {
      var hash = location.hash;
      var hasHash = hash.length > 1;
      if (hasHash) {
        location.hash = "#";
        location.hash = hash;
      }
    }, 0);
  }
};

module.exports = component(HashChange, function (cursor) {
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

    this.reloadHashChange();
  }

  return React.DOM.div({}, content);
});
