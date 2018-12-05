function UsersDAO(connection) {
  this._database = connection();
}

UsersDAO.prototype.insertUser = function (user) {

  this._database.open(function(err, mongoclient){
    mongoclient.collection("users", function(err, collection){
      collection.insert(user);

      mongoclient.close();
    });
  });

}

UsersDAO.prototype.autenticar = function (usuario, req, res) {//Metodo da classe
  this._database.open(function(err, mongoclient){//abri conexao com o servidor e db
    mongoclient.collection("users", function(err, collection){//Pega a coleção
        // collection.find({usuario:  usuario.usuario, senha:  usuario.senha}).toArray(function(err, result){
        collection.find(usuario).toArray(function(err, result){
          if(result[0] != undefined){
            req.session.autorizado = true;
            req.session.usuario = result[0].usuario;
            req.session.house = result[0].house;
          }

          mongoclient.close();
          
          if(req.session.autorizado){
            res.redirect("jogo");
            return;
          }
          else{
            res.render("index", {validacao: {}});
          }
        });

    });
  });


}

module.exports = function () {
  return UsersDAO;
}