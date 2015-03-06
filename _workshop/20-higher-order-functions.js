---
layout: workshop
collection: workshop
title: Higher order functions
section: 2
name: 20-higher-order-functions
next: 21-recursive-sum
slides: http://omniscientjs.github.io/workshop-talk
---

var adder = function (add) {
  return function (x) {
    return add + x;
  };
};

var add2 = adder(2);
it('adds 2 to number', () => {
  add2(4).should.equal(6);
});


var list = [1, 2, 3];
var square = function (n) {
  return n * n;
};
it('squares numbers', () => {
  list.map(square).should.eql([1, 4, 9])
});


var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var isFizzOrBuzz = function (n) {
  return n % 5 == 0 || n % 3 == 0;
};
it('keeps fizzbuzz numbers', () => {
  numbers.filter(isFizzOrBuzz).should.eql([3, 5, 6, 9, 10])
});


var multiply = function (acc, n) {
  return acc * n;
}
it('multiplies numbers', () => {
  numbers.reduce(multiply, 1).should.equal(3628800);
});


var episodes = [
  { name: "Cartman Gets an Anal Probe" },
  { name: "Weight Gain 4000" },
  { name: "Volcano" },
  { name: "Big Gay Al's Big Gay Boat Ride" },
  { name: "An Elephant Makes Love to a Pig" },
  { name: "Death" },
  { name: "Pinkeye" }
];
function asName (obj) {
  return obj.name;
}
function nth (list, i) {
  return list[i];
}
it('maps episodes => name', () => {
  nth(episodes.map(asName), 0).should.equal("Cartman Gets an Anal Probe");
  nth(episodes.map(asName), 1).should.equal("Weight Gain 4000");
});
