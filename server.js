var express = require('express');
var app = express();
var bodyParser=require('body-parser');
var bcrypt = require('bcrypt');
var _ = require('underscore');
var db = require('./db.js');
var middleware = require('./middleware.js')(db);
app.use(bodyParser.json());
var port = process.env.PORT || 3000;
var todos = [];
var todoId = 1;

app.get('/',function(req,res){
	res.send('Todod Api');
});

app.get('/todos',middleware.requireAuthentication,function(req,res){
	var filtredArray = [];
	var where={
		userId:req.user.get('id')
	};
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

app.get('/todos/:id',middleware.requireAuthentication,function(req,res){
		var todoId = parseInt(req.params.id);

		db.todo.findOne({
			where:{
				id: todoId,
				userId:req.user.get('id')
			}
		})
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

app.post('/todos',middleware.requireAuthentication,function(req,res){

	var body =_.pick(req.body,'desc','completed');

		console.log(body);
	db.todo.create(body).then(function(todo){
		
		req.user.addTodo(todo).then(function(){
			return todo.reload();
		}).then(function(todo){
			res.json(todo);
		});
		},function(err){
		res.status(400).send(err);
	});	
});

app.put('/todos/:id',middleware.requireAuthentication, function(req,res){

	
var attr ={};	
  var body = _.pick(req.body,'desc','completed');


if(body.hasOwnProperty('desc')){
	attr.desc = body.desc;
}

if(body.hasOwnProperty('completed')){
	attr.completed = body.completed;
}
console.log(attr);

  
  	
  var todoId = parseInt(req.params.id);

  db.todo.findOne({
  	where:{
  	id:todoId,
  	userId:req.user.get('id')
  	}
  }).then(function(todo){
  		if(todo){
  			return todo.update(attr).then(function(todo){
  				res.json(todo.toJSON());
  			},function(){
  				res.status(400).json(e);
  			});
  		}else{
  			res.status(404).send('Id not found');
  		}
  },function(){
  	res.status(500).send('Something went wrong');
  });
  
 

});

app.delete('/todos/:id',middleware.requireAuthentication,function(req,res){
	
	var todoId = parseInt(req.params.id);
	db.todo.destroy({
		where:{
			id:todoId,
			userId:req.user.get('id')
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

app.post('/users',function(req,res){
	var body = _.pick(req.body,'email','password');
	db.user.create(body).then(function(user){
		res.json(user.toPublicJSON());
	},function(err){
		res.status(400).json(err);
	})
});

app.post('/users/login',function(req,res){
	var body = _.pick(req.body,'email','password');
	console.log(body);
	
	db.user.authenticate(body).then(function(user){
		var token = user.generateToken('authentication');
		if(token){
			res.header('Auth',token).json(user.toPublicJSON());	
		}else{
			res.status(401).send();	
		}
		
	},function(){
		res.status(401).send();
	})
});







// app.use(middleware.logger);

// app.get('/aboutUs', middleware.requiredAuthentication, function(req,res){
// 	res.send('about us called!!');
// });

db.sequelize.sync(
	//{force:true}
	).then(function(){

app.listen(port,function(){
	console.log('I m listening');
});

	});

// app.use(express.static(__dirname+'/public'));
// console.log(__dirname);

// app.listen(port,function(){
// 	console.log('I m listening');
// });