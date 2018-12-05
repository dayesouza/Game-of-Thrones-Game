module.exports.index = function (app, req, res) {


  res.render('index', { validacao: {} });
}
module.exports.autenticar = function (app, req, res) {

  var dados_form = req.body;

  req.assert("usuario", "Digite o usuário").notEmpty();
  req.assert("senha", "Digite a senha").notEmpty();

  var erros = req.validationErrors();

  if (erros) {
    res.render("index", { validacao: erros });
    return;
  }

  var connection = app.config.dbConnection;
  var UsuariosDAO = new app.app.models.UsuariosDAO(connection);

  UsuariosDAO.autenticar(dados_form, req, res);

  //res.send('OK');
}