var EventEmitter = require("events").EventEmitter,
    React = require('react'),
    component = require('omniscient');

var Heading = require('./heading');

var events = new EventEmitter();
events.on('event', function (data) {
  console.log('Event!', data);
});


var h = Heading({ text: 'Click me, I fire events in the console.', statics: { events: events } });

module.exports.name = 'events';
module.exports.structure = null;
module.exports.init = function (el) {
  React.render(h, el);
};
