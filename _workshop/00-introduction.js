---
layout: workshop
collection: workshop
title: Introduction to the workshop
permalink: /workshop/
section: 0
start: true
name: 00-introduction
next: 01-basic-components
slides: http://omniscientjs.github.io/workshop-talk
---

// Creating components
var HelloWorld = component(_ => <h1>Hello World</h1>);

// Render inside correct wrapper
React.render(HelloWorld(),
  document.getElementById('result'));

describe('mocha inside the workshop', function () {
  it('shows tests', function () {
    expect(2).to.equal(2);
  });
  it('shows failing tests', function () {
    expect(2).to.equal(1, 'numbers should be equal');
  });
});
