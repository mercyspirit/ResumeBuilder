var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require('underscore');
var Handlebars = require('handlebars');
var _DATA = dataUtil.loadData('data.json').resume;
var _WIDGET = dataUtil.loadData('widget.json').widget;


$("#header").mousedown(function() {
	console.log("click");
  document.getElementById("header").innerHTML = _WIDGET.header.script; 
});