var component = require('omniscient');
var React = require('react');
var marked = require('marked');

var loadContentToCursor = require('../lib/loadContentToCursor');

var Header = require('./header');

var Promise = require('bluebird');

var mounted = defer();
var docs = defer();

var DidMount = { componentDidUpdate: mounted.resolve };

module.exports = component(DidMount, function (props) {
  var cursor = props.cursor;
  var pageData = cursor.get('content');

  var content;
  if (!pageData) {
    loadContentToCursor(cursor.get('doc'), cursor);
    content = React.DOM.p(null, cursor.get('load-message'));
  } else {
    content = React.DOM.div({
      dangerouslySetInnerHTML: {
        __html:marked(pageData)
      }
    });
    docs.resolve();
  }

  return React.DOM.div({}, content);
});

Promise
  .all([mounted.promise, docs.promise])
  .then(function () {
    var hash = location.hash;
    if (hash.length == 1) return;
    if (!hash) return;

    var el = document.querySelector(hash);
    if (!el) return;

    setTimeout(function () {
      var pos = findPos(el).top;
      document.body.scrollTop = pos - 50; // slightly less
    }, 0);
  });


function findPos (obj) {
  var curtop = 0, curleft = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }
  return { left: curleft, top: curtop };
}

// seriously? https://github.com/petkaantonov/bluebird/blob/master/API.md#deferred-migration
function defer() {
    var resolve, reject;
    var promise = new Promise(function() {
        resolve = arguments[0];
        reject = arguments[1];
    });
    return {
        resolve: resolve,
        reject: reject,
        promise: promise
    };
}
