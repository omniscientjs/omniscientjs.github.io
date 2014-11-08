var component = require('omniscient');
var React = require('react');
var d = React.DOM;

var Editable = require('./editable');

module.exports = component(function (props) {
  return d.li({}, Editable(props.cursor));
});

