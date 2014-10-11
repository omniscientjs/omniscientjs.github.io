var React = require('react'),
    component = require('omniscient'),
    Immutable = require('immutable');

var d = React.DOM;

module.exports = component(function (cursor, statics) {
  function addPost () {
    cursor.update(function (items) {
      var lastId = items.last().get('id');
      var nextId = Number(lastId) + 1;
      return items.push(Immutable.Map({ id: nextId, title: 'Post #' + nextId, text: 'Foo bar baz' }));
    });
  }
  return d.button({ onClick: addPost }, "Add");
});
