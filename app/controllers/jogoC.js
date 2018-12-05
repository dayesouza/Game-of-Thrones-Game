module.exports.jogo = function(app, req,res){

  if(!req.session.autorizado){
    res.send('Usuário precisa fazer login');
    return;
  }

  var msg = 'N';
  if(req.query.msg !== ''){
    msg = req.query.msg;
  }


  var usuario = req.session.usuario;
  var casa = req.session.casa;
  var connection = app.config.dbConnection;
  var jogoDAO = new app.app.models.JogoDAO(connection);

  jogoDAO.iniciaJogo(res, usuario, casa, msg);

}

module.exports.logout = function(app, req,res){
  req.session.destroy(function(err){
    res.render("index", {validacao: {}});
  });
}

module.exports.suditos = function(app, req,res){
  if(!req.session.autorizado){
    res.send('Usuário precisa fazer login');
    return;
  }

  //Traz acoes disponiveis
  var connection = app.config.dbConnection;
  var JogoDAO = new app.app.models.JogoDAO(connection);

  JogoDAO.getAcoesDisponiveis(req.session.usuario, res);
  return;

  //res.render("aldeoes", {validacao: {}});
}

module.exports.pergaminhos = function(app, req,res){

  if(!req.session.autorizado){
    res.send('Usuário precisa fazer login');
    return;
  }

  /* Recuperar acoes inseridas no banco de dados */
  var connection = app.config.dbConnection;
  var JogoDAO = new app.app.models.JogoDAO(connection);

  JogoDAO.getAcoes(req.session.usuario, res);
  return;
  //res.render("pergaminhos", {validacao: {}});
}

module.exports.ordenar_acao_sudito = function(app, req,res){

  if(!req.session.autorizado){
    res.send('Usuário precisa fazer login');
    return;
  }

  var dadosForm = req.body;

  req.assert('cod_acao',"Ação deve ser informada").notEmpty();
  req.assert('quantidade',"Quantidade deve ser informada").notEmpty();

  var erros = req.validationErrors();

  if(erros){
    res.redirect('jogo?msg=E');
    return;
  }

  var connection = app.config.dbConnection;
  var JogoDAO = new app.app.models.JogoDAO(connection);

  dadosForm.usuario = req.session.usuario;
  JogoDAO.acao(dadosForm, res);
}

module.exports.revogar_acao = function(app, req, res){
  var url_query = req.query;
  
  var connection = app.config.dbConnection;
  var JogoDAO = new app.app.models.JogoDAO(connection);

  JogoDAO.revogar_acao(url_query.id, res);

}