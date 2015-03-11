---
layout: workshop
collection: workshop
title: Immutable.js
section: 2
name: 22-immutable-js
next: 23-curry
prev: 21-recursive-sum
slides: http://omniscientjs.github.io/workshop-slides/#43
---
// ---
// Assignment: Use Immutable.js API to create lists and operate on that list.
// ---


// ES6 Destructuring, get Range, Map and List from Immutable.js
var { Range, Map, List } = Immutable;

// 1: Create a list of numbers from 0 to 99.
var numbers;

it('creates a range from 0 to 100', function () {
  numbers.get(0).should.equal(0);
  numbers.get(99).should.equal(99);
});

// Transform all numbers to a multiplum of 3
var tripled;

it('tripled every number', function () {
  tripled.get(40).should.equal(120);
});


// Pick only items from "tripled" which is even numbers (dividable by 2)
var filtered;

it('filters out/removes every number odd number', function () {
  filtered.get(2).should.equal(12);
  filtered.get(3).should.equal(18);
});

// Use reduce to sum all items in list "filtered"
var reduced;

it('reduces the numbers to find their sum', function () {
  reduced.should.equal(7350);
});
