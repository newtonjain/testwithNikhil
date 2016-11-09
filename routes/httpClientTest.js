var util = require('util');
var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function defaultRoute(req, res, next) {
    res.render('httpClientTest', { status: '' });
});

function callEndpoint2(echoString, onCompleteCallback) {
    var postData = JSON.stringify({ echoString: echoString });
    var options = {
        hostname:'requestb.in',
        port: 80,
        path: '/1f58jkp1',
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json',
            'mycustomheader1': 'hello'
        }
    };

    var req = http.request(options, function handleResponse(res) {
        var responseData = '';
        res.setEncoding('utf8');

        res.on('data', function handleChunk(chunk) {
            responseData += chunk;
        });

        res.on('end', function handleEnd() {
            onCompleteCallback(responseData);
        });
    });

    req.on('error', function handleError(err) {
        console.error('there was a problem calling /httpClientTest/callHello: %s', err.message);
        onCompleteCallback('there was a problem calling /httpClientTest/callHello: %s', err.message);
    });

    req.write(postData);
    req.end();
}

function callEndpoint(echoString, onCompleteCallback) {
    var postData = JSON.stringify({ echoString: echoString });
    var options = {
        hostname: 'localhost',
        port: 3000,
        path: '/httpClientTest/respondHello',
        method: 'POST',
        json: true,
        headers: {
            'content-type': 'application/json'
        }
    };

    var req = http.request(options, function handleResponse(res) {
        var responseData = '';
        res.setEncoding('utf8');

        res.on('data', function handleChunk(chunk) {
            responseData += chunk;
        });

        res.on('end', function handleEnd() {
            var message = '';
            try {
                var responseObject = JSON.parse(responseData);
                message = responseObject.msg;
            }
            catch (err) {
                message = responseData;
            }
            onCompleteCallback(message);
        });
    });

    req.on('error', function handleError(err) {
        console.error('there was a problem calling /httpClientTest/callHello: %s', err.message);
        onCompleteCallback('there was a problem calling /httpClientTest/callHello: %s', err.message);
    });

    req.write(postData);
    req.end();
}

function callHello(req, res, next) {
    callEndpoint(req.query.echoString, function callEndpointComplete(data) {
        res.render('httpClientTest', {
            status: data
        });
    });
}

function respondHello(req, res, next) {
    var msg = util.format('incorrect format of post data');
    if (req.body && req.body.echoString) {
        if (req.body.echoString.toLowerCase() === 'error') {
            console.error('they asked for an error');
            res.status(501).send('You asked for an error!');
            return;
        }
        else {
            msg = util.format('Hello %s', req.body.echoString);
        }
    }
    var response = { msg: msg };
    res.status(200).send(response);
}

router.get('/callHello', callHello);
router.post('/respondHello', respondHello);

module.exports = router;
