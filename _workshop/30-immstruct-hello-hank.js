---
layout: workshop
collection: workshop
title: Immstruct - Hello, Hank
section: 3
name: 30-immstruct-hello-hank
next: 31-immstruct-counter
prev: 24-cursors
slides: http://omniscientjs.github.io/workshop-slides/#57
---


var data = immstruct({ name: 'World!' });

// Create a Hello component that accepts a cursor for a name
// and renders "Hello, <name>!"
var Hello;

function render () {
  // Render the component with a cursor to name of the `data` structure
}

render();

// When data changes, rerender

setTimeout(function () {
  // Update the value of name in with the name 'Hank Pym'

}, 2000);

