---
layout: workshop
collection: workshop
title: Immstruct - clock
section: 3
name: 32-immstruct-clock
next: 33-mixins-never-rerender
slides: http://omniscientjs.github.io/workshop-talk
---

var data = immstruct({ time: new Date() });

var Clock = React.createClass({
  render: function () {
    var time = this.props.time.deref().toString()
    return <span>{time}</span>;
  }
});

var render = () => React.render(<Clock time={data.cursor('time')} />, el);
data.on('swap', () => render());
render();

setInterval(() => {
  data.cursor('time').update(_ => new Date());
}, 1000);
