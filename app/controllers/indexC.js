module.exports.index = function (app, req, res) {


  res.render('index', { validacao: {} });
}
module.exports.autenticar = function (app, req, res) {
  var dados_form = req.body;

  req.assert("username", "Type the user").notEmpty();
  req.assert("password", "Type the password").notEmpty();

  var erros = req.validationErrors();
  console.log(erros);

  if (erros) {
    res.render("index", { validacao: erros });
    return;
  }

  var connection = app.config.dbConnection;
  var UsersDAO = new app.app.models.UsersDAO(connection);

  UsersDAO.autenticar(dados_form, req, res);
}