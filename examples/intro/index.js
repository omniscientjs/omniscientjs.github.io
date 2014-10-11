var React     = require('react'),
    immstruct = require('immstruct'),
    component = require('omniscient');

var NameInput = component(function (cursor) {
  var onChange = function (e) {
    cursor.update('name', function (name) {
      return e.currentTarget.value;
    });
  };
  return React.DOM.input({ value: cursor.get('name'), onChange: onChange });
});

var Welcome = component(function (cursor) {
  var guest = cursor.get('guest');
  var name = guest.get('name') ? ", " + guest.get('name') : "";
  return React.DOM.p({}, cursor.get('greeting'), name, "!",
                         NameInput(guest));
});

var structure = immstruct({ greeting: 'Welcome', guest: { name: '' } });

// To run stand-alone do
// function render () {
//   React.renderComponent(
//     Welcome(structure.cursor()),
//     document.querySelector('.app'));
// }
//
// render();
// structure.on('swap', render);


module.exports = {
  name: 'intro',
  component: function (structure) {
    return Welcome(structure.cursor());
  },
  structure: structure
};
