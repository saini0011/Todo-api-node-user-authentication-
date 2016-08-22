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

sequelize.sync({force:true}).then(function(){
	console.log('everything works fine');
	Todo.create({
		desc:'take dog on walk',
		completed:false
	}).then(function(todo){
		return Todo.create({
		desc:'Go to Office'
	});

	}).then(function(){
		//return Todo.findById(1)
		return Todo.findAll({
			where:{
				//completed:false
				desc:{
					$like:'%o%'
				}
			}
		})
	}).then(function(todo){
		if(todo){

			todo.forEach(function(t){
			console.log(t.toJSON());	
			});
			
		}else{
			console.log('no todo');
		}

	}).catch(function(err){
		console.log('something went wrong',err);
	});
});