module.exports = function(application){
	application.get('/cadastro', function(req, res){
		application.app.controllers.cadastroC.cadastro(application, req, res);
	});

	application.post('/cadastrar', function(req, res){
		application.app.controllers.cadastroC.cadastrar(application, req, res);
	});
}