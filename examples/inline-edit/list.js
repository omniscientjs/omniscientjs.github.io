var component = require('omniscient');
var React = require('react');
var d = React.DOM;

var Item = require('./item');

module.exports = component(function (props) {
  return d.ul({}, props.cursor.toArray().map(function (item, key) {
    return Item('item-' + key, item);
  }));
});
