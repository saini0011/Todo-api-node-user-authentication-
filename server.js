var express = require('express');
var app = express();
var middleware = require('./middleware.js')
var port = process.env.PORT || 3000;
var todos = [{
	id:1,
	desc: 'Meet mom for lunch',
	completed: false
},
{
	id:2,
	desc: 'Go to market',
	completed: false
}];

app.get('/',function(req,res){
	res.json('Todod Api');
});

app.get('/todos',function(req,res){

	res.json(todos);

});

app.get('/todos/:id',function(req,res){
		var id = parseInt(req.params.id);
		console.log(id);
		var matchedTodo;
	todos.forEach(function(f){

		if(f.id===id){
			matchedTodo = f;
			
		}
		});
		if(matchedTodo){
			res.json(matchedTodo);
		}
		else{
			res.status(404).send();
		}
	
			

});



// app.use(middleware.logger);

// app.get('/aboutUs', middleware.requiredAuthentication, function(req,res){
// 	res.send('about us called!!');
// });

app.use(express.static(__dirname+'/public'));
console.log(__dirname);

app.listen(port,function(){
	console.log('I m listening');
});