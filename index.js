var express = require('express');
var bodyParser = require('body-parser');
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require('underscore');
var Handlebars = require('handlebars');

var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

var _DATA = dataUtil.loadData('data.json').resume;
var _WIDGET = dataUtil.loadData('widget.json').widget;

app.get('/', function(req, res) {
    _DATA = dataUtil.loadData('data.json').resume;
    _WIDGET = dataUtil.loadData('widget.json').widget;

    var basicInfo = _DATA.basicInfo;
  	var socialMedia = _DATA.socialMedia;
  	var skills = _DATA.skills;
  	var education = _DATA.education;
  	var experience = _DATA.experience;
  	var portfolio = _DATA.portfolio;
    var script = _WIDGET.header.script;

    res.render('test', { 
                                          	skills: skills,
                                          	experience: experience
                                          	});
});

app.post("/generate", function(req, res) {
  _DATA = dataUtil.loadData('data.json').resume;
    _WIDGET = dataUtil.loadData('widget.json').widget;

    var basicInfo = _DATA.basicInfo;
    var socialMedia = _DATA.socialMedia;
    var skills = _DATA.skills;
    var education = _DATA.education;
    var experience = _DATA.experience;
    var portfolio = _DATA.portfolio;
    var script = _WIDGET.header.script;

    var source = appendScript("./script.js",appendStyle("./css/style.css",splitcat("./views/layouts/main.handlebars", "./views/test.handlebars")));

    var template = Handlebars.compile(source);
    var result = template({ basicInfo: basicInfo,
                                            socialMedia: socialMedia,
                                            skills: skills,
                                            education: education,
                                            experience: experience,
                                            portfolio: portfolio});
    var fs = require('fs');
    fs.writeFile("index.html", result, function(err) {
    if(err) {
        return console.log(err);
    }
    });
    res.json({});
});

//add new info
app.post("/:widget/:type/add/:newinfo", function(req, res) {
    _widget = req.params.widget;
  	_type = req.params.type;
  	_newinfo = req.params.newinfo;

  	_DATA[_widget][_type] = _newinfo;
  	dataUtil.saveResumeData(_DATA, 'data.json');
    res.redirect('back');
});

// reset your data
app.post("/reset", function(req, res) {
  dataUtil.restoreOriginalData('data.json');
  _DATA = dataUtil.loadData('data.json').resume;
  res.redirect('back');
  
});

//calls localhost
app.listen(3000, function() {
    console.log('Listening on port 3000!');
});

function splitcat(mainfile, handlebarfile) {
  var fs = require('fs');
  var text = (fs.readFileSync(mainfile)).toString('utf8');
  var n = text.indexOf("{{{body}}}");
  var mainstr = text.substring(0,n - 1);
  var mainstr2 = text.substring(n + 10);
  var text2 = (fs.readFileSync(handlebarfile)).toString('utf8');
  return mainstr + text2 + mainstr2;
}

function appendStyle(cssfile,maintext) {
  var fs = require('fs');
  var n = maintext.indexOf("<head>");
  var text2 = (fs.readFileSync(cssfile)).toString('utf8');
  var mainstr = maintext.substring(0,n + 6);
  var mainstr2 = maintext.substring(n + 6);
  return mainstr + "<style>" + text2 + "</style>" + mainstr2;
}

function appendScript(javascript,maintext) {
  var fs = require('fs');
  var n = maintext.indexOf("<head>");
  var text2 = (fs.readFileSync(javascript)).toString('utf8');
  var mainstr = maintext.substring(0,n + 6);
  var mainstr2 = maintext.substring(n + 6);
  return mainstr + "<script>" + text2 + "</script>" + mainstr2;
}
