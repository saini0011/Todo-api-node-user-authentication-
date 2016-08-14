var express = require('express');
var app = express();

var middleware = {
	requiredAuthentication: function(req,res,next){
		console.log('private route hit');
		next();
	},
	logger: function(req,res,next){

		console.log(new Date().toString()+' '+req.method+' '+req.originalUrl);
		next();
	}
};

app.use(middleware.logger);

app.get('/aboutUs', middleware.requiredAuthentication, function(req,res){
	res.send('about us called!!');
});

app.use(express.static(__dirname+'/public'));
console.log(__dirname);

app.listen(3000,function(){
	console.log('I m listening');
});