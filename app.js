var express = require('express');
var path = require('path');
var http = require('http');
var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var router = express.Router();
var all_res = require('./res_collect');



//2017-4-21 jiajianrong disable默认打印到服务台
var app = express();
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


// /res/?js=a/b/c.js,x/y/z.js
app.use('/combo/*', function(req, res, next) {
    
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET');
    res.header('Content-Type', 'text/plain');
    
    // ---------------
    // ls_combo
    // ---------------
    var alljs = req.query.js || ''
    var jsarr = alljs.split(',')
    
    var str = jsarr.map(function(item){
        return all_res[item]
    }).join('\n/*==content==*/\n')
    
    res.send(str);
    return;
    
    // ---------------
    // ls_single
    // ---------------
    var r = all_res[req.originalUrl];
    res.send(r)
    return;
})


// static resource
app.use(express.static(path.join(__dirname, 'static')));


// home page
app.use('/', function(req, res, next) {
    res.send('404 err, please visit /index.html')
});


// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    console.log(err.stack);

    res.render('error', {
      message: err.message,
      error: err
    });
  });
}


// production error handler, no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});




var server = http.createServer(app);
server.listen('80');
//server.on('error', onError);
//server.on('listening', onListening);









