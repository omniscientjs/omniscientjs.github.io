---
layout: workshop
collection: workshop
title: Mixins - immutable.js shouldComponentUpdate
section: 3
name: 35-mixins-immutable-js-should-component-update
next: 36
slides: http://omniscientjs.github.io/workshop-talk
---

var { Range, List, Map } = Immutable;

var immutableMixin = {

  shouldComponentUpdate: function (nextProps) {
    var hasChanged = (value, key) => {
      var arePropsEqual = (typeof value.equals === 'function')
          ? value.equals(nextProps[key])
          : value === nextProps[key];
      console.log("shouldComponentUpdate: " + !arePropsEqual);
      return !arePropsEqual;
    };
    return Map(this.props).some(hasChanged);
  }
};

var Episode = React.createClass({
  mixins: [immutableMixin],
  render: function () {
    return <li>{this.props.name}</li>;
  }
});

var Show = React.createClass({
  mixins: [immutableMixin],
  render: function () {
    var episodes = this.props.show.get('episodes').map(function (name) {
      return <Episode key={name} name={name} />
    });

    return <ul>{episodes.toArray()}</ul>;
  }
});

var show = Immutable.fromJS({
  episodes: [ "Cartman Gets an Anal Probe", 'Weight Gain 400' ]
});

React.render(<Show show={show} />, el);

var updatedShow = show.updateIn(['episodes'], episodes => episodes.push('Volcano'));
setTimeout(() => React.render(<Show show={updatedShow} />, el), 1000);
