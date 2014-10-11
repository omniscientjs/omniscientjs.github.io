var React = require('react'),
    component = require('omniscient');

var List = require('./list');
var AddPost = require('./add-post');

module.exports = component(function (cursor, statics) {
  return React.DOM.div({ key: cursor.get('id') },
    React.DOM.p(null,
                cursor.get('title'),
                AddPost(cursor.get('items'))),
    List(cursor.get('items'))
  );
});
