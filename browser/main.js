var fs = require('fs');
var marked = require('marked');
var highlight = require('highlight.js');

var component = require('omniscient');
var immstruct = require('immstruct');
var React = require('react');

marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

var structure = immstruct({
  index: fs.readFileSync(__dirname + '/../index.md', 'utf-8')
});

var App = component(function (cursor) {
  return React.DOM.div({
    dangerouslySetInnerHTML: {
      __html:marked(cursor.get('index'))
    }
  });
});

var container = document.querySelector('.content-container');
var render = function () {
  React.renderComponent(App(structure.cursor()), container);
}

render();
structure.on('swap', render);
