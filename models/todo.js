module.exports = function(sequelize,DataTypes){
	return sequelize.define('todo',{
		desc:{
			type:DataTypes.STRING,
			allowNull:false,
			validate:{
				notEmpty:true,
				len:[1, 250]
			}
		},
		completed:{
			type:DataTypes.BOOLEAN,
			allowNull:false,
			defaultValue:false
		}
	})

}