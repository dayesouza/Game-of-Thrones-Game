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
  var house = req.session.house;
  var connection = app.config.dbConnection;
  var GameDAO = new app.app.models.GameDAO(connection);

  GameDAO.iniciaJogo(res, usuario, house, msg);

}

module.exports.logout = function(app, req,res){
  req.session.destroy(function(err){
    res.render("index", {validacao: {}});
  });
}

module.exports.subjects = function(app, req,res){
  if(!req.session.autorizado){
    res.send('User need to log-in');
    return;
  }

  //Traz acoes disponiveis
  var connection = app.config.dbConnection;
  var GameDAO = new app.app.models.GameDAO(connection);

  GameDAO.getAcoesDisponiveis(req.session.usuario, res);
  return;

  //res.render("aldeoes", {validacao: {}});
}

module.exports.parchments = function(app, req,res){

  if(!req.session.autorizado){
    res.send('User need to log-in');
    return;
  }

  /* Recuperar acoes inseridas no banco de dados */
  var connection = app.config.dbConnection;
  var GameDAO = new app.app.models.GameDAO(connection);

  GameDAO.getAcoes(req.session.usuario, res);
  return;
  //res.render("parchments", {validacao: {}});
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
  var GameDAO = new app.app.models.GameDAO(connection);

  dadosForm.usuario = req.session.usuario;
  GameDAO.acao(dadosForm, res);
}

module.exports.revogar_acao = function(app, req, res){
  var url_query = req.query;
  
  var connection = app.config.dbConnection;
  var GameDAO = new app.app.models.GameDAO(connection);

  GameDAO.revogar_acao(url_query.id, res);

}