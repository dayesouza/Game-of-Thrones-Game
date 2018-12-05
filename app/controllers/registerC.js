module.exports.cadastro = function(app, req,res){

  res.render('cadastro',{validacao: {}, dadosForm: {}});
}

module.exports.cadastrar = function(app, req,res){

  var dados_form = req.body;

  req.assert('name',"Name can't be empty").notEmpty();
  req.assert('user',"User can't be empty").notEmpty();
  req.assert('password',"Password can't be empty").notEmpty();
  req.assert('house',"House can't be empty").notEmpty();

  var erros = req.validationErrors();
  if(erros){
    res.render('cadastro', {validacao: erros, dadosForm: dados_form})
    return;
  }

  var dbConn = app.config.dbConnection;

  var UsersDAO = new app.app.models.UsersDAO(dbConn);
  UsersDAO.insertUser(dados_form);

  var GameDAO = new app.app.models.GameDAO(dbConn);
  GameDAO.gerarParametros(dados_form.usuario);
  
  res.send('ok');
}