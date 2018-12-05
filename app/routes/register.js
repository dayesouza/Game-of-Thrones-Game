module.exports = function(application){
	application.get('/register_page', function(req, res){
		application.app.controllers.registerC.cadastro(application, req, res);
	});

	application.post('/register', function(req, res){
		application.app.controllers.registerC.cadastrar(application, req, res);
	});
}