/**
  This example is using an older version of Omniscient and React.
  Pre 0.12.0 release of React.

  There are minor breaking changes in the syntax from the latest version.
***/

module.exports = function (el) {
  var React   = require('react'),
      RRouter = require('rrouter'),
      Routes  = RRouter.Routes,
      Route   = RRouter.Route;

  var immstruct = require('immstruct');

  var MainView = require('./main-view');
  var AboutView = require('./about-view');

  var mainData = immstruct({ text: 'Omniscient is awesome.' });
  var aboutData = immstruct({ text: 'About.' });

  var routes = Routes({},
                      Route({ name: 'main', path: '/', view: MainView, data: mainData }),
                      Route({ name: 'about', path: '/about', view: AboutView, data: aboutData }));

  var routing = RRouter.start(routes, function (view) {
    React.renderComponent(view, el);
  });

  // lister for change and redraw
  mainData.on('swap', rerender);
  aboutData.on('swap', rerender);
  function rerender () {
    routing.update();
  }

  // change the data
  setTimeout(function () {
    mainData.cursor().update(function (state) {
      return state.merge({ text: state.get('text') + " No, really." });
    });
  }, 2000);
};
