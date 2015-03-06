---
layout: workshop
collection: workshop
title: Cursors
section: 2
name: 24-cursors
next: 25-
slides: http://omniscientjs.github.io/workshop-talk
---
var { Map } = Immutable;
console.clear();

var map = Map({ message: "Look behind you, a Three-Headed Monkey!" });

var message = Cursor.from(map, 'message');

it('creates a cursor from the message', () => {
  message.deref().should.equal(
    "Look behind you, a Three-Headed Monkey!");
});


it('updates the value of the cursor', () => {
  var updatedMessage = message.update(v => "The ships hung in the sky in much the same way that bricks don't.");
  updatedMessage.deref().should.equal(
    "The ships hung in the sky in much the same way that bricks don't.");
});


it('should not modify the original cursor', () => {
  message.deref().should.equal(
    "Look behind you, a Three-Headed Monkey!");
});


it('calls the callback when a cursor is changed', (done) => {
  var data = Map({ meaningOfLife: 43 });

  var changeHandler = function (newValue, oldValue, path) {
    newValue.get('meaningOfLife').should.equal(42);
    done();
  };

  var cursor = Cursor.from(data, changeHandler);
  cursor.set('meaningOfLife', 42);
});


it('creates a cursor and an accompanying function that when called will always return the most recent value of the cursor', () => {
  var createUpdatedCursor = function (data) {
    var cursor;
    cursor = Cursor.from(data, function changeHandler (newData, oldData) {
      cursor = Cursor.from(newData, changeHandler);
    });

    return function () {
      return cursor;
    }
  };

  var data = Map({ value: 1337 });
  var getUpdatedCursor = createUpdatedCursor(data);

  getUpdatedCursor().set('value', 42);
  getUpdatedCursor().get('value').should.equal(42);

  getUpdatedCursor().set('value', 'oh yes');
  getUpdatedCursor().get('value').should.equal('oh yes');
});
