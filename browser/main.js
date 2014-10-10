var fs = require('fs');
var marked = require('marked');
var highlight = require('highlight.js');

// Synchronous highlighting with highlight.js
marked.setOptions({
  highlight: function (code) {
    return highlight.highlightAuto(code).value;
  }
});

var markdown = fs.readFileSync(__dirname + '/../index.md', 'utf-8');
document.querySelector('.content-container').innerHTML = marked(markdown);
