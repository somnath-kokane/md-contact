'use strict';

var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/public', {etag: false}));
app.use('/libs', express.static(__dirname + '/bower_components/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/contacts/', require('./modules/contact')());

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function(){
    console.log('server runs on http://localhost:'+app.get('port'));
})