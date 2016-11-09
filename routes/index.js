var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Glimpse for Express', status: '' });
});

function submitAction(req, res, next) {
    setTimeout(
        function handleTimeout() {
            res.render('index', {
                title: 'Glimpse for Express',
                status: 'Thanks for submitting!  You\'re request waited for ' + req.query.waitSeconds + ' seconds!' });
            console.log('this is a console.log() message');
            console.info('this is a console.info() message');
            console.warn('this is a console.warn() message.');
            console.error('this is a console.error() message');
        },
    req.query.waitSeconds * 1000);
}

function nonExistentView(req, res, next) {
    res.render('thisViewDoesNotExist', {
        myoption: 'hello 404'
    });
}

router.get('/submitAction', submitAction);

router.get('/nonExistentView', nonExistentView);

module.exports = router;
