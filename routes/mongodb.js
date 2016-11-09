var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var uuid = require('uuid');

var router = express.Router();

/* GET home page. */
router.get('/',
    function (req, res, next) {
        render(res);
    });

// TODO:  refactor this to manage state better
var database;
var collection;
var collectionName = 'testcollection';

function dbConnect(req, res, next) {
    return MongoClient.connect('mongodb://localhost:27017/test')
        .then(
            function connected(db) {
                database = db;
                return database.collection(collectionName);
            },
            function errorConnecting(err) {
                render(res, { err: err });
            })
        .then(
            function gotCollection(c) {
                collection = c;
                render(res, { status: 'connection successful' });
            },
            function err(err) {
                render(res, { err: err });
            });
}

/**
 * 
 */

/** 
 * numeric & boolean values in the options are being parsed as strings by express, so fix them up here
 */
function fixupOptions(options) {

    // convert from string to number for fields inside an option 
    var fixupNumericOptions = function (sortOptions) {
        var fixupObject = function(obj) {
            for (var key in obj) {
                if (obj.hasOwnProperty(key)) {
                    obj[key] = parseInt(obj[key]);
                }
            }
        };
    
        if (Array.isArray(sortOptions)) {
            for (var i=0; i<sortOptions.lenght; i++) {
                fixupObject(sortOptions[i]);
            }            
        }
        else if ( typeof sortOptions === 'object') {
            fixupObject(sortOptions);
        }
        return sortOptions;
    }


    // replace any string options with boolean values to be boolean values 
    var fixupBoolOptions = function (options) {
        var fixupBool = function(val) {
            var rtrn = val; 
            if (typeof val === 'string') {
                var lc = val.toLowerCase();
                if ( lc === 'true') {
                    rtrn = true;
                } 
                else if (lc === 'false') {
                    rtrn = false;
                }
            }
            return rtrn;
        };
    
        for (var key in options) {
            if (options.hasOwnProperty(key)) {
                options[key] = fixupBool(options[key]);
            }
        }
        return options;
    }
    
    if ( options) {
      if (options.sort) {
          options.sort = fixupNumericOptions(options.sort);
      }
      if ( options.projection) {
          options.projection = fixupNumericOptions(options.projection);
      }
      options = fixupBoolOptions(options);
   }
    return options;
}


function queryFind(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var cursor = collection.find(query);
        var options = fixupOptions(req.body.options);
        if (options.projection) {
            cursor.project(options.projection);
        }
        if ( options.sort ) {
            cursor.sort(options.sort);
        }
        cursor.toArray()
            .then(
                function toArraySuccess(docs) {
                    res.status(200).send(docs);
                },
                function toArrayFailed(err) {
                    res.status(400).send(err);
                });
    }
}

function queryFindOneAndUpdate(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var update = req.body.update;
        var options = fixupOptions(req.body.options);

        collection.findOneAndUpdate(query, update, options)
            .then(
                function findOneAndUpdateSuccess(docs) {
                    res.status(200).send([docs.value]);
                },
                function findOneAndUpdateFailed(err) {
                    res.status(400).send(err);
                });
    }
}

function queryFindOneAndDelete(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var options = fixupOptions(req.body.options);
      
        collection.findOneAndDelete(query, options)
            .then(
                function findOneAndDeleteSuccess(docs) {
                    res.status(200).send([docs.value]);
                },
                function findOneAndDeleteFailed(err) {
                    res.status(400).send(err);
                });
    }
}

function queryFindOneAndReplace(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var update = req.body.update;
        var options = fixupOptions(req.body.options);

        collection.findOneAndReplace(query, update, options)
            .then(
                function findOneAndReplaceSuccess(docs) {
                    res.status(200).send([docs.value]);
                },
                function findOneAndReplaceFailed(err) {
                    res.status(400).send(err);
                });
    }
}


function queryFindAndModify(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var update = req.body.update;
        var options = fixupOptions(options);
        var sort = req.body.options.sort;


        collection.findAndModify(query, sort, update, options)
            .then(
                function findAndModifySuccess(docs) {
                    res.status(200).send(docs);
                },
                function findAndModifyFailed(err) {
                    res.status(400).send(err);
                });
    }
}


function recreateCollection(req, res, next) {
    if (!collection) {
        render(res, { err: 'Not connected to mongoDB!' });
    }
    else {
        collection.drop()
            .then(
                function dropSuccess(reply) {
                    return database.createCollection(collectionName);
                },
                function dropError(err) {
                    res.render(res, { err: err });
                })
            .then(
                function collectionCreated(c) {
                    collection = c;
                    render(res, { status: 'collection re-created' });
                },
                function collectionCreateError(err) {
                    render(res, { err: err });
                });
    }
}

function deleteOne(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var options = fixupOptions(req.body.options);
        collection.deleteOne(query, options)
            .then(
                function findOneAndDeleteSuccess(result) {
                    res.status(200).send({status: 'Deleted ' + result.deletedCount + ' documents'});
                },
                function findOneAndDeleteFailed(err) {
                    res.status(400).send(err);
                });
    }
}

function deleteMany(req, res, next) {
    if (!collection) {
        res.status(400).send('Not connected to mongoDB!');
    }
    else {
        var query = req.body.selector;
        var options = fixupOptions(req.body.options);
        collection.deleteMany(query, options)
            .then(
                function findOneAndDeleteSuccess(result) {
                    res.status(200).send({status: 'Deleted ' + result.deletedCount + ' documents'});
                },
                function findOneAndDeleteFailed(err) {
                    res.status(400).send(err);
                });
    }
}

var  getNextOrdinal = (function(){
    var curr = 0;
    var inc = function(){
        return curr++;
    }
    return inc;
    
})();


function insertRecords(req, res, next) {
    var n = parseInt(req.query.numRecords.trim());

    var docs = [];
    for (var i = 0; i < n; i++) {
        docs.push({ 
            'a': uuid.v4(),
            'b': "" + getNextOrdinal(),
            'c': "" + 1 });
    }

    if (parseBool(req.query.usePromise)) {
        collection.insertMany(docs)
            .then(function insertSuccessful(r) {
                render(res, { status: 'inserted ' + r.insertedCount + ' records' });
            }, function insertError(err) {
                render(res, { err: err });
            });
    }
    else {
        collection.insertMany(docs, function insertCompleted(err, r) {
            if (err) {
                render(res, { err: err });
            }
            else {
                render(res, { status: 'inserted ' + r.insertedCount + ' records' });
            }
        });
    }
}

function parseBool(s) {
    if (typeof s !== 'string') {
        throw "Invalid type passed to parseBool";
    }

    s = s.trim().toLowerCase();
    return s === 'true';
}

function render(res, opts) {
    var gotCount = function gotCount(err, count) {
        opts = opts || {};
        if (err && !opts.err) {
            opts['err'] = err;
        }
        else if (!opts.err && !opts.status) {
            opts['status'] = 'got count';
        }
        if (!opts.title) {
            opts['title'] = 'Glimpse for Express and MongoDB';
        }
        if (count !== undefined && count !== null) {
            opts['count'] = count;
        }
        res.render('mongodb', opts);
    };

    if (collection) {
        collection.count(gotCount);
    }
    else {
        gotCount('Not connected to MongoDB');
    };
}

router.post('/find', queryFind);
router.post('/findAndModify', queryFindAndModify);
router.post('/findOneAndUpdate', queryFindOneAndUpdate);
router.post('/findOneAndDelete', queryFindOneAndDelete);
router.post('/findOneAndReplace', queryFindOneAndReplace);
router.post('/deleteOne', deleteOne);
router.post('/deleteMany', deleteMany);
router.get('/recreateCollection', recreateCollection);
router.get('/insert', insertRecords);
router.get('/connect', dbConnect);

module.exports = router;
