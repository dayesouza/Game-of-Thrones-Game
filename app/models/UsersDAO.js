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

UsersDAO.prototype.autenticar = function (user, req, res) {
  this._database.open(function(err, mongoclient){

    mongoclient.collection("users", function(err, collection){
        collection.find(user).toArray(function(err, result){
          console.log(user);
          console.log(result);
          if(result[0] != undefined){
            req.session.autorizado = true;
            req.session.usuario = result[0].user;
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