var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined,undefined,undefined,{
	'dialect':'sqlite',
	'storage':__dirname+'/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo',{
	desc:{
	type: Sequelize.STRING	
	},
	completed:{
	type: Sequelize.BOOLEAN	
	}
});

sequelize.sync().then(function(){
	console.log('everything works fine');
	Todo.create({
		desc:'walk the dog',
		completed:false
	}).then(function(todo){
		console.log('finished');
		console.log(todo);

	});
});