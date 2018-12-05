module.exports.cadastro = function(app, req,res){

  res.render('cadastro',{validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(app, req,res){

  var dados_form = req.body;

  req.assert('nome',"Nome não pode ser vazio").notEmpty();
  req.assert('usuario',"Usuário não pode ser vazio").notEmpty();
  req.assert('senha',"Senha não pode ser vazia").notEmpty();
  req.assert('casa',"Casa não pode ser vazia").notEmpty();

  var erros = req.validationErrors();
  if(erros){
    res.render('cadastro',{validacao: erros, dadosForm: dados_form})
    return;
  }

  var dbConn = app.config.dbConnection;

  var usuariosDAO = new app.app.models.UsuariosDAO(dbConn);
  usuariosDAO.inserirUsuario(dados_form);


  var jogoDAO = new app.app.models.JogoDAO(dbConn);
  jogoDAO.gerarParametros(dados_form.usuario);
  
  res.send('ok');
}