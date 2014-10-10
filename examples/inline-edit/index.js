var immstruct = require('immstruct');
    React     = require('react');

var List = require('./list');

var data = immstruct({
  items: [
    { text: 'one'   },
    { text: 'two'   },
    { text: 'three' }
  ]
});


// If using directly
// data.on('swap', render);
// render();
//
// function render () {
//   React.renderComponent(List(data.cursor('items')), el);
// }


module.exports = {
  name: 'inline-edit',
  component: function () {
    return List(data.cursor('items'));
  },
  structure: data
};
