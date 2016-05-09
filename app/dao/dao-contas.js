import {Storage, SqlStorage} from 'ionic-angular'


export class DAOContas {
  constructor(){
    let storage = new Storage(SqlStorage);

    storage.query('CREATE TABLE IF NOT EXISTS contas(id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT)')
      .then((data) => {
      }, (error) =>{
        console.log("Erro na criação da tabela " + JSON.stringify(error.err));
      });
  }

  getList(successCallback){

    this.lista = [];
    let storage = new Storage(SqlStorage);

    storage.query("SELECT * FROM contas ORDER BY descricao").then((data) => {

      for(var i = 0; i < data.res.rows.length; i++){
        let item = {};

        item.id = data.res.rows.item(i).id;
        item.descricao = data.res.rows.item(i).descricao;

        this.lista.push(item);
      }
      successCallback(this.lista);
    }, (error) => {
      console.log("Erro ao buscar os dados na tabela");
    });
  }

  insert(conta, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("INSERT INTO contas(descricao) VALUES(?)", [conta.descricao]).then((data) => {
      conta.id = data.res.insertid;
      successCallback(conta);
    }, (error) => {
      console.log("Erro " + JSON.stringify(error.err));
    });

  }

  edit(conta, successCallBack){
    let storage = new Storage(SqlStorage);

    storage.query("UPDATE contas SET descricao = ? WHERE id = ?", [conta.descricao, conta.id])
      .then((data) => {
        successCallBack(conta);
      }, (error) =>{
        console.log("Não foi possível atualizar a conta"); 
      });
  }

  delete(conta, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("DELETE FROM contas WHERE id = ?", [conta.id])
      .then((data) => {
        successCallback(conta);
      }, (error) =>{
        console.log("Não foi possível deletar a conta");
      });
  }

}
