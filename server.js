var express = require('express');
var app = express();
var middleware = require('./middleware.js');
var bodyParser=require('body-parser');
var _ = require('underscore');
var db = require('./db.js');
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var todos = [];
var todoId = 1;

app.get('/',function(req,res){
	res.send('Todod Api');
});

app.get('/todos',function(req,res){
	var filtredArray = [];
	var where={};
	var queryString = req.query;
	if(queryString.hasOwnProperty('completed')&&queryString.completed==='true'){
		where.completed=true;
		
	}
	else if(queryString.hasOwnProperty('completed')&&queryString.completed==='false'){
		where.completed=false;
		
	} 

	// else{
	//     res.status(400).send("Bad Request Data");	
	//   }

	if(queryString.hasOwnProperty('desc')&&queryString.desc.trim().length>0){
		where.desc={
			$like:'%'+queryString.desc+'%'	
		};
	}
			db.todo.findAll({where:where})
			.then(function(todos){
				res.json(todos);
			},function(err){
				res.status(500).send();
			}
			);
	// if(queryString.hasOwnProperty('completed')&&queryString.completed==='true'){
	// 	filtredArray = _.filter(todos,function(todo){return todo.completed===true });
	// 	if(queryString.hasOwnProperty('desc')&&queryString.desc.trim().length>0){
	// 	filtredArray = _.filter(filtredArray,function(todo){return todo.desc.indexOf(queryString.desc)>-1});
	// 	if(filtredArray.length===0){
	// 			res.send("No Entries Found");	
	// 		}
	// 		else{
	// 		res.json(filtredArray);
	// 		}
		
	// }
	// 	else{ 
	// 		if(filtredArray.length===0){
	// 			res.send("No Entries Found");	
	// 		}
	// 		else{
	// 		res.json(filtredArray);
	// 		}
	// 	}
	// }
	// else if(queryString.hasOwnProperty('completed')&&queryString.completed==='false'){
	// 	filtredArray = _.filter(todos,function(todo){return todo.completed===false});
	// 	if(queryString.hasOwnProperty('desc')&&queryString.desc.trim().length>0){
	// 	filtredArray = _.filter(filtredArray,function(todo){return todo.desc.indexOf(queryString.desc)>-1});
	// 	if(filtredArray.length===0){
	// 			res.send("No Entries Found");	
	// 		}
	// 		else{
	// 		res.json(filtredArray);
	// 		}
	// }
	// 	else{ 
	// 		if(filtredArray.length===0){
	// 			res.send("No Entries Found");	
	// 		}
	// 		else{
	// 		res.json(filtredArray);
	// 		}
	// 	}

	// }
	 
	 


	
	

});

app.get('/todos/:id',function(req,res){
		var id = parseInt(req.params.id);

		db.todo.findById(id)
		.then(function(todo){
			if(!!todo){
				res.json(todo.toJSON());	
			}
			else{
				res.status(404).send('ID not found');
			}
			

		}).catch(function(err){
			res.status(400).send(err);
		});
		//console.log(id);
	// 	var matchedTodo;
	// todos.forEach(function(f){

	// 	if(f.id===id){
	// 		matchedTodo = f;
			
	// 	}
	// 	});
	// 	if(matchedTodo){
	// 		res.json(matchedTodo);
	// 	}
	// 	else{
	// 		res.status(404).send("ID not Found");
	// 	}
	
			

});

app.post('/todos',function(req,res){

	var body =_.pick(req.body,'desc','completed');
	if(_.isBoolean(body.completed)&&_.isString(body.desc)&&body.desc.trim().length>0){
		console.log(body);
	db.todo.create(body)
	.then(function(todo){
		res.json(todo);
	})
	.catch(function(err){
		res.status(400).send(err);
	});	
	// body.id = todoId;
	// body.desc = body.desc.trim();
	// todos.push(body);
	// todoId++;
	//res.send(body);

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
	
	var todoId = parseInt(req.params.id);
	db.todo.destroy({
		where:{
			id:todoId
		}
	}).then(function(todoDeleted){
		if(todoDeleted===0){
			res.status(404).send('No Todo ID found to delete');
		}else{
			res.status(204).send('Data Deleted');
		}
	});
	// 	var id;
	// if((id = parseInt(req.params.id))&&todos.length>0){
	//   todos = _.reject(todos,function(t){ return t.id===id});
	//   res.json(todos);
	// }
	// else{
	// 	res.status(400).send("Bad Request Data");
	// }

});








// app.use(middleware.logger);

// app.get('/aboutUs', middleware.requiredAuthentication, function(req,res){
// 	res.send('about us called!!');
// });

db.sequelize.sync().then(function(){

app.listen(port,function(){
	console.log('I m listening');
});

	});

app.use(express.static(__dirname+'/public'));
console.log(__dirname);

// app.listen(port,function(){
// 	console.log('I m listening');
// });