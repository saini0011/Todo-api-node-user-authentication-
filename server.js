var express = require('express');
var app = express();
var middleware = require('./middleware.js');
var bodyParser=require('body-parser');
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var todos = [];
var todoId = 1;

app.get('/',function(req,res){
	res.json('Todod Api');
});

app.get('/todos',function(req,res){

	res.json(todos);

});

app.get('/todos/:id',function(req,res){
		var id = parseInt(req.params.id);
		//console.log(id);
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

app.post('/todos',function(req,res){

	var body = req.body;
	body.id = todoId;
	todos.push(body);
	todoId++;
	res.send(body);


});

app.put('/todos/:id', function(req,res){
	var body = req.body;
	var id = parseInt(req.params.id);
	todos.ForEach(function(t){
		if(t.id===id){
			t.desc = body.desc;
			t.completed = body.completed;

		}
	});

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