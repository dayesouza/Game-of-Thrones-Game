module.exports.index = function (app, req, res) {


  res.render('index', { validacao: {} });
}
module.exports.autenticar = function (app, req, res) {

  var dados_form = req.body;

  req.assert("usuario", "Type the user").notEmpty();
  req.assert("senha", "Type the password");

  var erros = req.validationErrors();

  if (erros) {
    res.render("index", { validacao: erros });
    return;
  }

  var connection = app.config.dbConnection;
  var UsersDAO = new app.app.models.UsersDAO(connection);

  UsersDAO.autenticar(dados_form, req, res);
}