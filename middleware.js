module.exports = function(db){

	return{
		requireAuthentication:function(req,res,next){
				var token = req.get('Auth');
				db.user.findByToken(token).then(function(user){
					req.user= user;
					next();	
				},function(){
					res.status(401).send();
				});
		}

	};

};


// var middleware = {
// 	requiredAuthentication: function(req,res,next){
// 		console.log('private route hit');
// 		next();
// 	},
// 	logger: function(req,res,next){

// 		console.log(new Date().toString()+' '+req.method+' '+req.originalUrl);
// 		next();
// 	}
// };

// module.exports = middleware;