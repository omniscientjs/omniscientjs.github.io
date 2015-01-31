var http = require('http');
var marked = require('marked');
var highlight = require('highlight.js');

marked.setOptions({
  highlight: function (code) {
    // return '<div class="window window--code">' + highlight.highlightAuto(code).value + '</div>';
    return highlight.highlightAuto(code).value;
  }
});



var apiEl = document.querySelector('.js-api-content');
var guideEl = document.querySelector('.js-guide-content');
var tutorialJsx = document.querySelector('.js-tutorials-content-jsx');
var tutorial = document.querySelector('.js-tutorials-content');


if (document.location.pathname.indexOf('/api') !== -1) {
  http.get({ path : '/documents/API-Reference.md' }, function (res) {
    var data = '';

    res.on('data', function (buf) {
      data += buf;
    });

    res.on('end', function () {
      apiEl.innerHTML = marked(data);
    });
  });
}

if (document.location.pathname.indexOf('/guide') !== -1) {
  http.get({ path : '/documents/Simpler-UI-Reasoning-with-Unidirectional-Dataflow-and-Immutable-Data.md' }, function (res) {
    var data = '';

    res.on('data', function (buf) {
      data += buf;
    });

    res.on('end', function () {
      guideEl.innerHTML = marked(data);
    });
  });
}

if (document.location.pathname.indexOf('/tutorials') !== -1) {
  http.get({ path : '/documents/Basic-Tutorial:-Creating-List-with-Live-Filtering---JSX-Edition.md' }, function (res) {
    var data = '';

    res.on('data', function (buf) {
      data += buf;
    });

    res.on('end', function () {
      tutorialJsx.innerHTML = marked(data);
    });
  });

  http.get({ path : '/documents/Basic-Tutorial:-Creating-List-with-Live-Filtering.md' }, function (res) {
    var data = '';

    res.on('data', function (buf) {
      data += buf;
    });

    res.on('end', function () {
      tutorial.innerHTML += marked(data);
    });
  });
}