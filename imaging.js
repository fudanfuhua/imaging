#!/usr/bin/env node
var childProcess = require('child_process'),
    phantomjs = require('phantomjs'),
    program = require('commander'),
    colors = require('colors'),
    binPath = phantomjs.path,
    config = require('./config.js');

function _fixedImageUrl(url) {
    if (url.match(/http[s]*\:\/\//)) return url;
    else if (url.match(/[a-zA-Z]\:/) || url.match(/^\//)) return url;
    else return process.cwd().replace('/$','') + '/' + url;
}
function _run (imgUri, options, callback) {
    var optParams = {};

    var childArgs = [
      __dirname + '/run.js',
      encodeURIComponent(imgUri)
    ]

    if (options.width) {
        optParams.width = options.width;
    } else {
        optParams.width = config.defaultWidth;
    }
    if (options.char) {
        optParams.char = options.char;
    } else {
        optParams.char = config.char.default;
    }
    if (options.left) {
        optParams.left = options.left;
    } else {
        optParams.left = config.defaultLeft;
    }
    
    childArgs.push(JSON.stringify(optParams));
    childArgs.push(encodeURIComponent(__dirname));
    childArgs.push('./');

    childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
        if (err) console.log(err);
        // else console.log(stdout);
        callback && callback(stdout);
    })
}

exports.draw = function (/*src, [options], callback*/) {

    var args = arguments,
        src = args[0],
        options = {},
        callback = null;

    var imgUri = src;
    if (!imgUri) {
        console.log('Please give a correct image url !'.red)
        return;
    } else {
        imgUri = _fixedImageUrl(imgUri);
    }
    var param2 = args[1];

    if (typeof(param2) == 'function') {
        callback = param2;
    } else if (typeof(param2) == 'object'){
        options = param2;
    }
    if (!callback) callback = args[2];

    _run(imgUri, options, callback);
}

