var React = require('react');
var component = require('omniscient');
var d = React.DOM;

var FocusOnRender = {
  componentDidMount: function () {
    this.getDOMNode().select();
  }
};

module.exports = component(FocusOnRender, function (props, statics) {
  var onChange = statics.onChange || function () {};
  return d.input({ value: props.cursor.get('text'), onChange: onChange });
});
