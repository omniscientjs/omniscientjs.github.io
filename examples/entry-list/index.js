var React = require('react'),
    immstruct = require('immstruct');

var structure = immstruct({
  title: 'Add and delete posts.',
  items: [
    { id: 1, title: 'Post #1', text: 'Foo bar baz' },
    { id: 2, title: 'Post #2', text: 'Foo bar baz' },
    { id: 3, title: 'Post #3', text: 'Foo bar baz' },
    { id: 4, title: 'Post #4', text: 'Foo bar baz' }
  ]
});

var App = require('./app');

module.exports.name = 'entry-list';
module.exports.structure = structure;
module.exports.init = function (el) {
  render();
  structure.on('next-animation-frame', render);

  function render () {
    React.render(App(structure.cursor()), el);
  }
};
