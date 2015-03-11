---
layout: workshop
collection: workshop
title: Omniscients shouldComponentUpdate in React
section: 3
name: 40-omniscients-shouldComponentUpdate-in-react
next: 41-hello-omniscient
prev: 35-mixins-immutable-js-should-component-update
slides: http://omniscientjs.github.io/workshop-slides/#65
---

// ---
// Assignment: Make use of omniscient's shouldComponentUpdate
// instead of the one you wrote in the previous assignment
// ---

// Create the immutableMixin using  omniscient's shouldComponentUpdate
// for your shouldComponentUpdate method
var immutableMixin = {

};

// Enable debugging for the omniscient.shouldComponentUpdate mixin
// and watch the debug output in the console.
// Does all episodes render every time, or just the ones that
// changed?


var Episode = React.createClass({
  mixins: [immutableMixin],

  render: function () {
    return <li>{this.props.name}</li>;
  }
});

var Show = React.createClass({
  mixins: [immutableMixin],

  render: function () {
    var episodes = this.props.show.get('episodes').toArray().map(function (name) {
      return <Episode key={name} name={name} />
    });

    return <div>
      <h1>Shows</h1>
      <ul>{episodes}</ul>
    </div>;
  }
});

var show = Immutable.fromJS({
  episodes: [ "Cartman Gets an Anal Probe", 'Weight Gain 400' ]
});

React.render(<Show show={show} />, el);

var updatedShow = show.updateIn(['episodes'], episodes => episodes.push('Volcano'));
setTimeout(() => React.render(<Show show={updatedShow} />, el), 1000);
