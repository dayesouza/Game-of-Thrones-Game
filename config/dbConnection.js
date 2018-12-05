/* Importar mongodb */
var mongo = require('mongodb');

var connMongoDB = function(){

  var db = new mongo.Db(
    'got',//nome do banco
    new mongo.Server(
      'localhost',//string contenco o endereço do servidor
      '27017',//Porta de conexão
    )
  );

  return db;
}

module.exports = function () {
  return connMongoDB;
}
