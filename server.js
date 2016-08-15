var express = require('express');
var app = express();
var middleware = require('./middleware.js')
var port = process.env.PORT || 3000;


app.use(middleware.logger);

app.get('/aboutUs', middleware.requiredAuthentication, function(req,res){
	res.send('about us called!!');
});

app.use(express.static(__dirname+'/public'));
console.log(__dirname);

app.listen(port,function(){
	console.log('I m listening');
});