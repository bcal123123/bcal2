var express = require('express');
var app = express();
var path = require('path');

var port = process.env.port || 8200;

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});

app.listen(8200);