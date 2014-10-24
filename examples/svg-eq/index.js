var component = require('omniscient');
var immstruct = require('immstruct');
var Immutable = require('immutable');
var React = require('react');

var d = React.DOM;

var mic = require('./mic');
var samples = require('./samples');

var MAX_VALUE = 200, SIZE = samples, WIDTH = 1;

mic.on('error', function (e) {
  console.error('initializing mic failed', e);
});

var structure = immstruct({ mic: { running: false, audio: [] } });

mic.on('audio', function (array) {
  structure.cursor('mic').update('audio', function () {
    return Immutable.Vector.from(array);
  });
});

var Rect = component(function (sample, statics) {
  var value = sample.deref() / MAX_VALUE * SIZE;
  return d.rect({ x: statics.i * WIDTH,
                  y: SIZE - value,
                  width: WIDTH,
                  height: value,
                  fill: color(value) });
});

var svgAttrs = {
  preserveAspectRatio: 'none', // stretch to fill container
  viewBox: '0 0 ' + SIZE + ' ' + SIZE,
  style: { height: '100%', width: '100%', display: 'block' }
};

function run () {
  mic.start();
  structure.cursor('mic').update('running', function () {
    return true;
  });
}

var Eq = component(function (mic) {
  if (!mic.get('running')) {
    return d.div({},
                 d.p({}, "This example shows an svg equalizer for your microphone (chrome only) "),
                 d.button({ onClick: run }, 'Run it!'));
  }

  var audio = mic.cursor('audio');
  var rects = [svgAttrs].concat(audio.map(function (value, i, parent) {
    return Rect('rect-'+i, parent.cursor(i), { i: i });
  }).toArray());
  return d.div({ className: 'eq' }, d.svg.apply(d.svg, rects));
});

function color (value) {
  var r = (parseInt(value / MAX_VALUE * 16)).toString(16);
  return ['#', r, r, '0000'].join('');
}

module.exports.name = 'svg-eq';
module.exports.showStructure = false;
module.exports.structure = structure;
module.exports.init = function (el) {
  render();
  structure.on('swap', render);

  function render () {
    React.renderComponent(Eq(structure.cursor('mic')), el);
  }
};


