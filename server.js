// var auth = require('http-auth');
var http = require('http');
var st = require('st');

// var api = require('./lib/api');


var port = process.env.PORT || 3000;
var isDeveloper = process.env.NODE_ENV === 'development';

var POC_USERNAME = process.env.POC_USERNAME || 'test';
var POC_PASSWORD = process.env.POC_PASSWORD || 'test';

// // Authenticate if production enviroment.
// var basic = auth.basic({ realm: "Omniscient" },
// function (username, password, callback) {
//   callback(username === POC_USERNAME && password === POC_PASSWORD);
// }
// );

var options = {
  path: __dirname + '/',
  index: 'index.html',
  dot: false
};

if (isDeveloper) {
  options['cache'] = false;
}

var mount = st(options);
var httpHandlers = [function(req, res) {
  // if (req.url.indexOf('api') !== -1) {
  //   return api(req.url, res);
  // }

  if(mount(req, res)) return;

  res.statusCode = 404;
  res.end('Not found');
}];
//
// if (!isDeveloper) {
//   httpHandlers = [basic].concat(httpHandlers);
// }

// Start server
http.createServer.apply(http, httpHandlers).listen(port);

var message = 'Starting server at port ' + port + ' ';
if (!isDeveloper) {
  message += ['with credentials', POC_USERNAME, '/', POC_PASSWORD].join(' ');
} else {
  message += ' without authentication!';
}

console.log(message);
