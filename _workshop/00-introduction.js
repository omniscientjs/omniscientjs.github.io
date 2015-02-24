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

// Drawing components
var HelloWorld = component(_ => <h1>Hello World</h1>);

// Draw on correct wrapper
React.render(HelloWorld(),
  document.getElementById('result'));

// Run tests
var expect = chai.expect;

describe('mocha inside the workshop', function () {
  it('shows tests', function () {
    expect(2).to.equal(2);
  });
});
