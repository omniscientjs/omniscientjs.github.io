---
layout: workshop
collection: workshop
title: Cursors
section: 2
name: 24-cursors
next: 30-immstruct-hello-hank
prev: 23-curry
slides: http://omniscientjs.github.io/workshop-slides/#54
---

var { Map } = Immutable;

var map = Map({ message: "Look behind you, a Three-Headed Monkey!" });

// Create a cursor to the message property of the map
// and store the reference to it in the message variable
var message;

it('creates a cursor from the message', function () {
  message.deref().should.equal(
    "Look behind you, a Three-Headed Monkey!");
});


// Update the value of the message cursor to make the test pass
var updatedMessage;

it('updates the value of the cursor', function () {
  updatedMessage.deref().should.equal(
    "The ships hung in the sky in much the same way that bricks don't.");
});


it('should not modify the original cursor', function () {
  // Write a test to make sure your previous update did not change the
  // original message variable
  message.deref().should.equal(
    "Look behind you, a Three-Headed Monkey!");
});


it('calls the callback when a cursor is changed', function (done) {
  var data = Map({ meaningOfLife: 43 });

  // Create a cursor from the data, and pass the changeHandler
  // function as a callback to get called when the value of the
  // cursor is modified
  var cursor;

  // Update the cursor with the correct value
  // cursor[..]

  function changeHandler (newValue, oldValue, path) {
    // Assert that the new value of meaningOfLife is 42
    newValue.get('meaningOfLife').should.equal(42);

    done();
  };
});


it('creates a cursor and an accompanying function that when called will always return the most recent value of the cursor', function () {

  var createUpdatedCursor = function (data) {
    // This function should receive an immutable.js data structure
    // It should create a cursor from the data
    // Whenever the data changes make sure you update the reference of the current cursor
    // to a new cursor with the new data
    var cursor;


    // Return a function that returns your cursor
    // return ...
  };

  var data = Map({ value: 1337 });

  var getUpdatedCursor = createUpdatedCursor(data);

  getUpdatedCursor().set('value', 42);
  getUpdatedCursor().get('value').should.equal(42);
});
