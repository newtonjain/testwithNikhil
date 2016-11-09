
var glimpseAgent = requireGlimpseAgent();
var glimpseServer = requireGlimpseServer();

glimpseServer.server.init();
glimpseAgent.agent.init({
    server: glimpseServer.server
});

var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');
var mongodbRoutes = require('./routes/mongodb');
var httpClientTestRoutes = require('./routes/httpClientTest');
var consoleLoggingTestRoutes = require('./routes/consoleLoggingTest');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/mongodb', mongodbRoutes);
app.use('/httpClientTest', httpClientTestRoutes);
app.use('/consoleLoggingTest', consoleLoggingTestRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;

function requireGlimpseAgent() {
    var glimpseAgentModuleName = '@glimpse/glimpse-node-agent';
    if (linkWithRelativePaths()) {
        glimpseAgentModuleName = '../../src/glimpse.agent/release/glimpse.js';
    }
    return require(glimpseAgentModuleName);
}

function requireGlimpseServer() {
    var glimpseServerModuleName = '@glimpse/glimpse-node-server';
    if (linkWithRelativePaths()) {
        glimpseServerModuleName = '../../src/glimpse.server/release/src/glimpse.js';
    }
    return require(glimpseServerModuleName);
}

/** 
 * VS Code has a bug with setting breakpoints in symlink'd files, so 
 * this is a workaround to link directly to the agent & server sources 
 * to use the debugger.
 */
function linkWithRelativePaths() {

    var useRelativePaths = false;
    for (var i = 0; i < process.argv.length; i++) {
        if (process.argv[i] === '--loadGlimpseWithRelativePaths') {
            useRelativePaths = true;
            break;
        }
    }

    var os = require('os');
    var isWindows = os.platform() === 'win32';
    return useRelativePaths && isWindows;
}