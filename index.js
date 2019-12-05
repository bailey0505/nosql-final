/**********************************


Main Routing for No Sql Final Application 
By: Bailey Rotellini

**********************************/


var express = require('express');
var exphbs  = require('express-handlebars');
var bodyParser = require('body-parser');
const fs = require('fs');
var mysql = require('mysql');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var path = require('path');
var validator = require('validator');
const request = require('request');


var pageinfo = require("./framework/pageinfo.js");
var handleForm = require("./framework/form.js");

var app = express();

app.use(cookieParser());

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));


app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(express.urlencoded());

app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

app.set('port', process.env.PORT || 3001);

app.use(express.static(__dirname + '/style'));
app.use(express.static(__dirname + '/scripts'));
app.use(express.static(__dirname + '/images'));
app.use(express.static(__dirname + '/public')); 
app.use(express.static(__dirname + '/videos')); 


app.get('/', function(req, res) {
	pageinfo.getHome(function(header, headertwo, apiTitle, apiPara, resumetitle, resumePara, formTitle, formpara){
		res.render('home', {
			success : req.session.success,
			header_text : header,
			headertwo_text : headertwo,
			apiTitle_text : apiTitle,
			apiPara_text : apiPara,
			resumeTitle_text : resumetitle,
			resumePara_text : resumePara,
			formTitle_text : formTitle,
			formPara_text : formpara,
			
			
		});
		
	});
	delete req.session.success;
});

app.get('/resume', function(req, res) {
     pageinfo.getJobTitle(function(JobTitle, JobCompany, JobTime, JobDuties, CollegeName, StartDate, EndDate){
		res.render('resume', {
			job_title : JobTitle,
			job_compasny : JobCompany,
			job_time : JobTime,
			job_duties : JobDuties,
			college_name : CollegeName,
			start_date : StartDate, 
			end_date : EndDate,
		});
	});
});
app.get('/webservice', function(req, res) {
    res.render('webservice', {
        obj1 : req.session.object1,
        obj2 : req.session.object2,
        obj3 : req.session.object3,
        obj4 : req.session.object4,
    });
});
app.get('/form', function(req, res) {
    res.render('form', {
		fail : req.session.danger,
		
	});
	delete req.session.danger;
});


app.post('/getobj', (req, res) =>{
    
    function GetObjects(callback) {
         var start = req.body.start;
         var end = req.body.end;
        start = start.replace("/", "-");
        start = start.replace("/", "-");
        end = end.replace("/", "-");
        end = end.replace("/", "-");


        var url = "https://api.nasa.gov/neo/rest/v1/feed?start_date=" + start + "&end_date=" + end + "&api_key=Lc6NCTh30hQHFTRYcOeO4mY9DVD0NB67rqSiJ1hu";

        request(url, { json: true }, (err, res, body) => {
            if(err) {
                res.redirect("505");
                callback("/505")
            }else{
              var objs = []
               var first = body.near_earth_objects[start][0].name;
                var second = body.near_earth_objects[start][1].name;
                 var third = body.near_earth_objects[end][0].name;
                var fourth = body.near_earth_objects[end][1].name;
                objs = [first, second, third, fourth];
                 //console.log(objs[0]);
               req.session.object1 = objs[0];
                req.session.object1 = objs[1];
                req.session.object3 = objs[2];
                 req.session.object4 = objs[3];
                callback("/webservice")

            }
        });
        
    }
    GetObjects(function(data){
        res.redirect(data);
    });
});

app.post('/formpost', (req, res) => {
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var email = req.body.email;
	
	handleForm.postForm(firstname, lastname, email, function(status, message){
		if(status === 'suc') {
			req.session.success = message;
			res.redirect('/');
		}else {
			req.session.danger = message;
			res.redirect('/form');
		}
	})
})

app.use(function(req, res, next){
    res.status(404);
    res.render('404');
});
app.use(function(err, req, res, next){
   console.log(err.stack);
    res.status(500);
    res.render('505');
});




app.listen(app.get('port'), function(){
 console.log( 'Express started on http://localhost:' +
 app.get('port') + '; press Ctrl-C to terminate.' );
    
});