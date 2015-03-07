---
layout: workshop
collection: workshop
title: Recursive sum
section: 2
name: 21-recursive-sum
next: 22-immutable-js
slides: http://omniscientjs.github.io/workshop-talk
---

it('sums numbers recursively', function () {
 sum([1, 2, 3, 4], 0).should.equal(10);
});

function sum (list, acc) {
  if (!list.length) return acc;
  return sum(list.slice(1), acc + list[0])
}
