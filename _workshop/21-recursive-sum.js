---
layout: workshop
collection: workshop
title: Recursive sum
section: 2
name: 21-recursive-sum
next: 22-immutable-js
slides: http://omniscientjs.github.io/workshop-talk
---

// Make function "sum(list, acc)" which recursivly sums a list.
// If acc is undefined it should be 0.
// If list is empty return total accumulated values
function sum (list, acc) {
  acc = acc || 0;
  if (!list.length) return acc;
  return sum(list.slice(1), acc + list[0])
}

// Tests for

it('sums numbers recursively', function () {
 sum([1, 2, 3, 4]).should.equal(10);
 sum([4, 5, 6, 7]).should.equal(22);
});

