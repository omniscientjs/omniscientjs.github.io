---
layout: workshop
collection: workshop
title: Higher order functions
section: 2
name: 20-higher-order-functions
next: 21-recursive-sum
prev: 08-render-a-clock-using-setinterval
slides: http://omniscientjs.github.io/workshop-slides/#29
---
// ---
// Assignment: Try out different higher order functions as
// returning functions, using functions as arguments (map, filter, reduce)
// ---



// 1: Higher Order Functions

// Make a function "adder" which takes a number as an argument.
// "adder" should return a function which takes another number as argument
// the returned function should give result of adding the two arguments
// e.g. adder(2)(3) === 6
var adder;

// Make a "add2" from "adder" which can double any value
var add2;
it('adds 2 to numbers', () => {
  // Use "add2" to add 2 + 4 and save to "result"
  var result;

  result.should.equal(6);
});



// 2: Transforming data through map
var list = [1, 2, 3];

// Make function "square" which takes argument and
// returns the squared result
var square;

it('squares numbers', () => {
  // Transform items in list to their squares using map.
  // Save to result
  var result;

  result.should.eql([1, 4, 9])
});


// List for comming tasks
var numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];


// 3: Picking items in list by filter

// Make predicate function "isFizzOrBuzz" which takes argument number
// and returns bool if argument is dividable by 5 or devidable by 3
var isFizzOrBuzz;

it('keeps fizzbuzz numbers', () => {
  // Make new list (based on "numbers") with only items that
  // fulfills the isFizzOrBuzz predicate.
  // Save to result
  var result;

  result.should.eql([3, 5, 6, 9, 10])
});


// 4: Reducing list to a number

// Make a function which takes two arguments and return
// the multiplication result of the arguments
var multiply;

it('multiplies numbers', () => {
  // Use reduce to multiply all numbers in "numbers" to one int.
  // Save to result
  var result;

  result.should.equal(3628800);
});


// 5: Transforming data and picking elements
var episodes = [
  { name: "Cartman Gets an Anal Probe" },
  { name: "Weight Gain 4000" },
  { name: "Volcano" },
  { name: "Big Gay Al's Big Gay Boat Ride" },
  { name: "An Elephant Makes Love to a Pig" },
  { name: "Death" },
  { name: "Pinkeye" }
];

// Make two functions:
// - "asName(obj)" returns "name" property of argument object
// - "nth(list, i)" returns nth item (defined by second argument) of passed list


it('maps episodes => name', function () {
  // make resultOne and resultTwo which contains
  // the first and second name of the episodes using
  // the functions you created (asName and nth)
  var resultOne;
  var resultTwo;

  resultOne.should.equal("Cartman Gets an Anal Probe");
  resultTwo.should.equal("Weight Gain 4000");
});
