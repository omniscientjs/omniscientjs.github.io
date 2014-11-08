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

module.exports.name = 'inline-edit';
module.exports.structure = data;
module.exports.init = function (el) {
  render();
  data.on('next-animation-frame', render);

  function render () {
    React.render(List(data.cursor('items')), el);
  }
};
