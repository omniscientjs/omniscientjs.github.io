---
layout: workshop
collection: workshop
title: Recursive sum
section: 2
name: 20-recursive-sum
next: 02-passing-props
slides: http://omniscientjs.github.io/workshop-talk
---

it('should sum numbers', () => {
 sum([1, 2, 3, 4], 0).should.equal(10);
});

function sum (list, acc) {
  if (!list.length) return acc;
  return sum(list.slice(1), acc + list[0])
}
