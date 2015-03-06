---
layout: workshop
collection: workshop
title: Curry
section: 2
name: 23-curry
next: 24-cursors
slides: http://omniscientjs.github.io/workshop-talk
---

var curry = function (fn) {
  var numargs = fn.length;
  return createRecurser([]);

  function createRecurser (acc) {
    return function () {
      var args = [].slice.call(arguments);
      return recurse(acc, args);
    };
  }

  function recurse (acc, args) {
    var newacc = acc.concat(args);
    if (newacc.length < numargs) {
      return createRecurser(newacc);
    }
    else {
      return fn.apply(this, newacc);
    }
  }
};

var add = curry(function (a, b, c) {
  return a + b + c;
});

it('curries add', () => {
  var add2 = add(2);
  var add4 = add2(2);

  add(2)(2)(2).should.equal(6);

  add2(2)(3).should.equal(7);
  add2(2)(4).should.equal(8);

  add4(5).should.equal(9);

  add(1, 2, 3).should.equal(6);
  add(1)(2, 3).should.equal(6);
  add(1, 2)(3).should.equal(6);
  add(1)(2)(3).should.equal(6);
});

var times = curry(function (a, b, c) {
  return a * b * c;
});

it('curries times', () => {
  var times2 = times(2);
  var times4 = times2(2);

  times(2)(2)(2).should.equal(8);

  times2(2)(3).should.equal(12);

  times4(4).should.equal(16);

  times(2, 3, 4).should.equal(24);
  times(2)(3, 4).should.equal(24);
  times(2, 3)(4).should.equal(24);
  times(2)(3)(4).should.equal(24);
});
