var MongoClient = require('mongodb').MongoClient;

exports.getJobTitle = function(callback){
    MongoClient.connect("mongodb://localhost:27017/final", function (err, db) {
	   //mongodb://localhost:27017/final
		 if(err){
			 console.log(err);
		 }else{
			 //console.log(db);
			 var dbo = db.db("final");
			 var query = { page : "resume" };
			 dbo.collection("resumepage").find(query).toArray(function(err, results){
				if(err) {
					console.log(err);
					db.close();
				} else {
					console.log(results[0]["JobTitle"]);
					var JobTitle = results[0]["JobTitle"];
					var JobCompany = results[0]["JobCompany"];
					var JobTime = results[0]["JobTime"];
					var JobDuties = results[0]["JobDuties"];
					var CollegeName = results[0]["CollegeName"];
					var StartDate = results[0]["StartDate"];
					var EndDate = results[0]["EndDate"];
					callback(JobTitle, JobCompany, JobTime, JobDuties, CollegeName, StartDate, EndDate);
					
					db.close();
				}
				 
			 });
			  var values = [];
			  
			 
		 }
    });
 }
 
 exports.getHome = function(callback) {
	  MongoClient.connect("mongodb://localhost:27017/final", function (err, db) {
		  if(err){
			 console.log(err);
		 }else {
			 var dbo = db.db("final");
			 var query = { page : "home" };
			 dbo.collection("homepage").find(query).toArray(function(err, results) {
				if(err) {
					console.log("error");
					db.close();
				}else{
					var header = results[0]["header"];
					var headertwo = results[0]["headertwo"];
					var apiTitle = results[0]["apiTitle"];
					var apiPara = results[0]["apiPara"];
					var resumetitle = results[0]["resumetitle"];
					var resumePara = results[0]["resumePara"];
					var formTitle = results[0]["formTitle"];
					var formpara = results[0]["formpara"];
					
					callback(header, headertwo, apiTitle, apiPara, resumetitle, resumePara, formTitle, formpara);
					db.close();
				} 
				 
			 });
		 }
		  
	  });
 }