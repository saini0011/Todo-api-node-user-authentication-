var express = require('express');
var app = express();
var middleware = require('./middleware.js');
var bodyParser=require('body-parser');
var _ = require('underscore');
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var todos = [];
var todoId = 1;

app.get('/',function(req,res){
	res.send('Todod Api');
});

app.get('/todos',function(req,res){
	var filtredArray = [];
	var queryString = req.query.completed;
	if(queryString==='true'){
		filtredArray = _.filter(todos,function(todo){return todo.completed===true })
		res.json(filtredArray);
	}
	else if(queryString==='false'){
		filtredArray = _.filter(todos,function(todo){return todo.completed===false })
		res.json(filtredArray);
	}
	else{
	    res.status(400).send("Bad Request Data");	
	  } 


	
	

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
			res.status(404).send("ID not Found");
		}
	
			

});

app.post('/todos',function(req,res){

	var body =_.pick(req.body,'desc','completed');
	if(_.isBoolean(body.completed)&&_.isString(body.desc)&&body.desc.trim().length>0){
		console.log(body);
	body.id = todoId;
	body.desc = body.desc.trim();
	todos.push(body);
	todoId++;
	res.send(body);

	}
    else{
	    res.status(400).send("Bad Request Data");	
	  }


});

app.put('/todos/:id', function(req,res){

	if(todos.length>0){
		//console.log('url hit');
  var body = _.pick(req.body,'desc','completed');
  if(_.isBoolean(body.completed)&&_.isString(body.desc)&&body.desc.trim().length>0){
  	var matchedTodo;
  var id = parseInt(req.params.id);
  var response = todos.forEach(function(t){
	  if(t.id===id){
        t.desc = body.desc;
        t.completed = body.completed;
        res.send(t);
        //return;
	  }
	  else{
	    res.status(404).send("Id Not Found");	
	  }
	});
  }
  	else{
	    res.status(400).send("Bad Request Data");	
	  }

  
 }

 else{
	res.status(404).send("Bad Request Data");
}

});

app.delete('/todos/:id',function(req,res){
		var id;
	if((id = parseInt(req.params.id))&&todos.length>0){
	  todos = _.reject(todos,function(t){ return t.id===id});
	  res.json(todos);
	}
	else{
		res.status(400).send("Bad Request Data");
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