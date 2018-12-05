var ObjectID = require('mongodb').ObjectID;
function JogoDAO(connection) {
  this._connection = connection();
  this._actions_list = [];
  this._jogo;
}

JogoDAO.prototype.gerarParametros = function(usuario) {
  //TODO: Fazer gerar dependendo da casa
  this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    mongoclient.collection("jogos", function(err, collection) {
      //Pega a coleção
      collection.insert({
        usuario: usuario,
        moedas: 15,
        suditos: 10,
        temor: Math.floor(Math.random() * 1000),
        sabedoria: Math.floor(Math.random() * 1000),
        comercio: Math.floor(Math.random() * 1000),
        magia: Math.floor(Math.random() * 1000)
      });

      mongoclient.close();
    });
  });
};

JogoDAO.prototype.iniciaJogo = function(res, usuario,casa, msg) {
  this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    mongoclient.collection("jogos", function(err, collection) {
      //Pega a coleção
      // collection.find({usuario:  usuario.usuario, senha:  usuario.senha}).toArray(function(err, result){
      collection.find({ usuario: usuario }).toArray(function(err, result) {

        this._jogo = result[0];
        console.log(result[0]);
        res.render("jogo", {img_casa: casa, jogo: result[0], msg: msg})

        mongoclient.close();
      });
    });
  });
};

JogoDAO.prototype.acao = function(acao,res) {

  return this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    //verificar se pode realizar uma acao e tem pessoa e moeda
    console.log(this._jogo.moedas);
    if(this._jogo.moedas <= 0){
      mongoclient.close();
      res.redirect("jogo?msg=M");
      return;
    }

    acao.acao = retornaAcao(acao.cod_acao);
    mongoclient.collection("acoes", function(err, collection) {
      //Pega a coleção      
      acao.time_insercao = new Date().getTime();
      acao.termina_em = new Date().getTime() + (acao.acao.minutos * 60000);
      delete acao.cod_acao;
      collection.insert(acao); 
    });

    mongoclient.collection("jogos", function(err, collection) {
      //Pega a coleção      

      var quantidade = acao.quantidade;
      var valor_moedas =  -(acao.acao.moedas * quantidade);
      collection.update({usuario: acao.usuario}, {$inc: {moedas: valor_moedas}}); 

      mongoclient.close();
    });

    res.redirect("jogo?msg=S");
    return;
  });

  function retornaAcao(codigo){
    for(var i = 0; i < this._actions_list.length; i++){
      console.log("codigo", codigo);

      if(this._actions_list[i].codigo == codigo){
        return this._actions_list[i];
      }
    }
  }
};

JogoDAO.prototype.getAcoesDisponiveis = function(usuario, res) {
  this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    mongoclient.collection("actions_list", function(err, collection) {
      //Pega a coleção
      // collection.find({usuario:  usuario.usuario, senha:  usuario.senha}).toArray(function(err, result){
      collection.find().toArray(function(err, result) {
        this._actions_list = result;
        res.render("aldeoes", {actions_list: result});     
        mongoclient.close();
      });
    });
  });

};

JogoDAO.prototype.getAcoes = function(usuario, res) {
  this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    mongoclient.collection("acoes", function(err, collection) {
      //Pega a coleção
    var _acoes;

      // collection.find({usuario:  usuario.usuario, senha:  usuario.senha}).toArray(function(err, result){
      collection.find({ usuario: usuario, termina_em: {$gt:new Date().getTime()}}).toArray(function(err, result) {
        _acoes = result;
      });

      collection.find({ usuario: usuario, termina_em: {$lt:new Date().getTime()}}).sort({termina_em:1}).limit(2)
      .toArray(function(err, result) {
        
        res.render("pergaminhos", {acoes: _acoes, acoes_anteriores: result});
        mongoclient.close();
      });
    });
  });

};

JogoDAO.prototype.revogar_acao = function(id_acao, res) {
  this._connection.open(function(err, mongoclient) {
    //abri conexao com o servidor e db
    mongoclient.collection("acoes", function(err, collection) {
      //Pega a coleção
      // collection.find({usuario:  usuario.usuario, senha:  usuario.senha}).toArray(function(err, result){
      collection.remove({ _id: ObjectID(id_acao)},function(err, result){
        res.redirect("jogo?msg=D");
      });

      mongoclient.close();
    });
  });

};

module.exports = function() {
  return JogoDAO;
};
