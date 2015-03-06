---
layout: workshop
collection: workshop
title: Immutable.js
section: 2
name: 22-immutable-js
next: 23-curry
slides: http://omniscientjs.github.io/workshop-talk
---

var { Range, Map, List } = Immutable;

var numbers = Range(0, 100);

it('creates a range from 0 to 100', () => {
  numbers.get(0).should.equal(0);
  numbers.get(99).should.equal(99);
});

var tripled = numbers.map(x => 3 * x);

it('tripled every number', () => {
  tripled.get(40).should.equal(120);
});

var filtered = tripled.filter(x => x % 2 == 0);

it('filters out/removes every number odd number', () => {
  filtered.get(2).should.equal(12);
  filtered.get(3).should.equal(18);
});

var reduced = filtered.reduce((acc, x) => acc + x, 0);

it('reduces the numbers to find their sum', () => {
  reduced.should.equal(7350);
});
