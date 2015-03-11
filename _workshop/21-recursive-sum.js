---
layout: workshop
collection: workshop
title: Recursive sum
section: 2
name: 21-recursive-sum
next: 22-immutable-js
prev: 20-higher-order-functions
slides: http://omniscientjs.github.io/workshop-slides/#29
---
// ---
// Assignment: Use recursivity to sum numbers in a list.
// ---



// Make function "sum(list, acc)" which recursivly sums a list.
// If acc is undefined it should be 0.
// If list is empty return total accumulated values
function sum (list, acc) { }

it('sums numbers recursively', function () {
 sum([1, 2, 3, 4]).should.equal(10);
 sum([4, 5, 6, 7]).should.equal(22);
});
