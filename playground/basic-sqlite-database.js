var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	desc:{
	type: Sequelize.STRING,	
	allowNull:false,
	validate:{
		len:[1,250]
	}
	},
	completed:{
	type: Sequelize.BOOLEAN,
	allowNull:false,
	defaultValue:false	
	
	}
});

var User = sequelize.define('user',{
	email:Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync(
	//{force:true}
	).then(function(){
	console.log('everything works fine');
	User.findById(1).then(function(user){
		user.getTodos({where:{
			completed:false
		}}).then(function(todos){
			todos.forEach(function(t){
				console.log(t.toJSON());
			});
		});
	});
	// User.create({
	// 	email:'sid@sid.com'
	// }).then(function(){
	// 	return Todo.create({
	// 		desc:'clear yard',
	// 	});
	// }).then(function(todo){
	// 	User.findById(1).then(function(user){
	// 		user.addTodo(todo);
	// 	});
	// });
	
});