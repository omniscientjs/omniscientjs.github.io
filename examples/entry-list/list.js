var EventEmitter = require("events").EventEmitter,
    React = require('react'),
    component = require('omniscient');

var Item = require('./item');

var events = new EventEmitter();

var didMountMixin = {
  componentDidMount: function () {
    var self = this;
    // Will rerender, so remove all listeners.
    events.on('delete', function (item) {
      self.props.cursor.update(function (state) {
        // Use toVector() https://github.com/facebook/immutable-js/issues/122
        return state.splice(state.indexOf(item), 1).toVector();
      });
    });
  }
};

module.exports = component(didMountMixin, function (cursor, statics) {
  var items = cursor.toArray().map(function (item, key) {
    return Item("item-" + key, item, { events: events });
  });

  return React.DOM.section({},
                           items.length ? items
                                        : React.DOM.span({}, "No more posts."));
});
