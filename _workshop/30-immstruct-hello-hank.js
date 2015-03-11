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

// ---
// Assignment: Create the Hello component, and add a listener
// for the swap event of the immstruct strucure that will
// rerender the component with the new data. Update the data
// structure and watch the outputted namename  change
// ---

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

