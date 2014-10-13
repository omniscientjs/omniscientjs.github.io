var React = require('react');
var immstruct = require('immstruct');
var component = require('omniscient');
var EventEmitter = require('events').EventEmitter;

var data = JSON.parse(require('fs').readFileSync(__dirname + '/../sourceData.json', 'utf-8'));
var structure = immstruct('reactions', data);

var PhotoBooth = require('./components/photobooth');
var setPropsMixin = require('omniscient-mixins/mixins/swapProps');

var members = {
  handleSubmit: function (e) {
    e.preventDefault();
    this.setProps({ isInAddMode: true });
  },

  handleClose: function () {
    this.setProps({ isInAddMode: false });
  }
};

var mixins = [members, setPropsMixin];
var ReactionBox = component(mixins, function (cursor) {
  var hiddenClass = cursor.get('isInAddMode') ? 'hidden' : '';

  var events = new EventEmitter();
  events.on('close', this.handleClose);

  var sharedState = { isInAddMode: cursor.get('isInAddMode') };

  return (
    React.DOM.div({ className: 'container' },
      React.DOM.h1(null, 'Reactions'),
      PhotoBooth({
        cursor: cursor.get('pb'),
        shared: sharedState
      }, { events: events }),
      React.DOM.button({ onClick: this.handleSubmit, className: 'btn-start ' + hiddenClass }, 'Try Your Reaction')
    )
  );
});

var body = document.querySelector('body');
function render () {
  console.log('Render');
  React.renderComponent(ReactionBox(structure.cursor(['app'])), body);
}

render();
structure.on('swap', render);
