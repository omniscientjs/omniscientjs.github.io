var EventEmitter = require("events").EventEmitter,
    React = require('react'),
    component = require('omniscient');

var Item = require('./item');
var events = new EventEmitter();

module.exports = component(function (cursor, statics) {
  console.log("rerender");
  var items = cursor.toArray().map(function (item, key) {
    return Item("item-" + key, item, { events: events });
  });

  // Will rerender, so remove all listeners.
  events.removeAllListeners();
  events.once('delete', function (item) {
    cursor = cursor.update(function (state) {
      // Use toVector() https://github.com/facebook/immutable-js/issues/122
      return state.splice(state.indexOf(item), 1).toVector();
    });
  });

  return React.DOM.section({},
                           items.length ? items
                                        : React.DOM.span({}, "No more posts."));
});
