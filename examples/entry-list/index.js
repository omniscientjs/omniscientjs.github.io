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

// Use directly
// render();
// structure.on('swap', render);
//
// function render () {
//   React.renderComponent(App(structure.cursor()), el);
// }


module.exports = {
  name: 'entry-list',
  component: function () {
    return App(structure.cursor())
  },
  structure: structure
}
