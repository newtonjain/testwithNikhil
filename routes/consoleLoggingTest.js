var util = require('util');
var express = require('express');
var router = express.Router();
var http = require('http');
var chalk = require('chalk');
chalk.enabled = true;

/* GET home page. */
router.get('/', function defaultRoute(req, res, next) {
    res.render('consoleLoggingTest', { status: '' });
});

router.get('/basic', function basic(req, res, next) {
    console.log('server: console.log:  This is a %%s string replacement:  %s', 'hello from the server!');
    console.warn('server: console.warn:  This is a %%d number replacement:  %d', 10);
    console.error('server: console.error:  This is a %%j object replacement:  %j', { hello: 'from the server!' });
    console.info('server: console.info');

    res.render('consoleLoggingTest', { status: 'basic logging examples', scriptPath: '/scripts/consoleLogging/basic.js' });
});

router.get('/colors', function colors(req, res, next) {
    console.log('server: ' + chalk.blue('I am blue text'));
    console.log('server: ' + chalk.bgBlue('I have a blue background'));
    console.log('server: ' + chalk.bgGreen.yellow('1st things 1st, obey your thirst: Sprite'));
    console.log('server: ' + chalk.dim('I am dim'));
    console.log('server: ' + chalk.bold('I am bold'));

    res.render('consoleLoggingTest', { status: 'color examples', scriptPath: '/scripts/consoleLogging/color.js' });
});

router.get('/unicodeCharacters', function someFunkyCharacters(req, res, next) {
    console.log('server: %s', '\u26A0 \u26A0  \u26A0');
    console.log('server: I have a URL: http://www.getglimpse.com');

    res.render('consoleLoggingTest', { status: 'unicode and emoticon examples', scriptPath: '/scripts/consoleLogging/unicodeAndEmoticons.js' });
});

router.get('/timing', function serverSideTiming(req, res, next) {
     console.log('server: about to start timer %s', 'serverT1');
    console.time('serverT1');
    setTimeout(() => {
        console.log('server: still inside timer %s', 'serverT1');
        console.timeEnd('serverT1');
        console.log('server: timeEnd called for %s', 'serverT1');
        res.render('consoleLoggingTest', { status: 'timing examples', scriptPath: '/scripts/consoleLogging/timing.js' });
    }, 5000);
});

router.get('/clientSideGrouping', function serverSideTiming(req, res, next) {
    res.render('consoleLoggingTest', { status: 'client-side grouping examples', scriptPath: '/scripts/consoleLogging/groups.js' });
});

router.get('/clientSideProfile', function serverSideTiming(req, res, next) {
    res.render('consoleLoggingTest', { status: 'client-side profiling examples', scriptPath: '/scripts/consoleLogging/profile.js' });
});

router.get('/count', function serverSideTiming(req, res, next) {
    res.render('consoleLoggingTest', { status: 'client-side count examples', scriptPath: '/scripts/consoleLogging/count.js' });
});

router.get('/dir', function serverSideTiming(req, res, next) {
    console.log('server: console.dir statement');
    console.dir({a:  'this is an object sent through server\'s console.dir', b: { c: 'this is a sub-object' }});
    res.render('consoleLoggingTest', { status: 'client-side profiling examples', scriptPath: '/scripts/consoleLogging/dir.js' });
});

router.get('/table', function serverSideTiming(req, res, next) {
    res.render('consoleLoggingTest', { status: 'client-side profiling examples', scriptPath: '/scripts/consoleLogging/table.js' });
});



module.exports = router;

