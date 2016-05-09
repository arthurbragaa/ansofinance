import {Storage, SqlStorage} from 'ionic-angular';

export class DAOLancamentos {

  constructor(){
    let storage = new Storage(SqlStorage);

    storage.query("CREATE TABLE IF NOT EXISTS lancamentos " +
                  "(id INTEGER PRIMARY KEY AUTOINCREMENT, conta TEXT, valor REAL, " +
                  "data INTEGER, descricao TEXT, entradaSaida TEXT, pago INTEGER )")
      .then((data) => {
      }, (error) => {
        console.log("Erro na criação da tabela de lançamentos " + JSON.stringify(error.err));
      });
  }


  getList(dataInicio, dataFim, successCallback){
    let storage = new Storage(SqlStorage);

    var lancamentos = [];

    storage.query("SELECT * FROM lancamentos WHERE data >= ? AND data <= ?",
                  [dataInicio.getTime(), dataFim.getTime()])
      .then((data) => {
      for(var i = 0; i < data.res.rows.length; i++){
        let lancamentoDB = data.res.rows.item(i);

        let lancamento = {
          id: lancamentoDB.id,
          conta: lancamentoDB.conta,
          valor: lancamentoDB.valor,
          data: lancamentoDB.data,
          descricao: lancamentoDB.descricao,
          entradaSaida: lancamentoDB.entradaSaida,
          pago: lancamentoDB.pago
        };

        lancamentos.push(lancamento);
      }
      successCallback(lancamentos);

    }, (error) => {
      console.log("Erro ao buscar os lançamentos");
    });
  }

  insert(lancamento, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("INSERT INTO lancamentos(descricao, valor, data, conta, entradaSaida, pago) " +
                  "VALUES(?, ?, ?, ?, ?, ?)",
                  [lancamento.descricao, lancamento.valor, lancamento.data.getTime(),
                  lancamento.conta, lancamento.entradaSaida, lancamento.pago]).then((data) => {
                    successCallback(lancamento);
                  }, (error) => {
                    console.log("Erro: " + JSON.stringify(error.err));
                  });
  }

  edit(lancamento, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query("UPDATE lancamentos SET descricao = ?, valor = ?, data = ?, conta = ?," +
                  "entradaSaida = ?, pago = ? WHERE id = ?", [lancamento.descricao, lancamento.valor,
                                                              lancamento.data.getTime(),
                                                              lancamento.conta, lancamento.entradaSaida,
                                                              lancamento.pago, lancamento.id]
                 ).then((data) => {
                   successCallback(lancamento);
                 }, (error) => {
                   console.log("Erro: " + JSON.stringify(error.err));
                 });
  }

  delete(lancamento, successCallback){
    let storage = new Storage(SqlStorage);
    storage.query("DELETE FROM lancamentos WHERE id = ?", [lancamento.id])
      .then((data) => {
        successCallback(lancamento);
      }, (error) => {
        console.log("Não foi possível deletar a conta");
      });
  }

  getSaldo(successCallback) {
    let storage = new Storage(SqlStorage);
    storage.query(`
     SELECT TOTAL(valor) as saldo, entradaSaida FROM lancamentos
     WHERE pago = 1 AND entradaSaida = 'entrada'
     UNION
     SELECT TOTAL(valor) as saldo, entradaSaida FROM lancamentos
     WHERE pago = 1 AND entradaSaida = 'saida'
    `).then((data) => {
      let saldo = 0;
      for(var i = 0; i < data.res.rows.length; i++){
        let item = data.res.rows.item(i);
        if(item.entradaSaida == 'entrada')
          saldo += item.saldo;
        else
          saldo -= item.saldo;
      }
      successCallback(saldo);
    });

  }

  changePaymentStatus(lancamento, successCallback){
    let storage = new Storage(SqlStorage);
    let status = lancamento.pago == 1 ? 0 : 1;

    storage.query("UPDATE lancamentos SET pago = ? WHERE id = ?", [status, lancamento.id])
      .then((data) =>{
        successCallback(lancamento);
      });
    
  }

  getListGroupByConta(dataInico, dataFim, entradaSaida, successCallback){
    let storage = new Storage(SqlStorage);

    storage.query(
      `
        SELECT conta, TOTAL(valor) as saldoConta FROM lancamentos
        WHERE data >= ? and data <= ? and entradaSaida = ?
        AND pago = 1
        GROUP BY conta

      `,[dataInico.getTime(), dataFim.getTime(), entradaSaida]).then((data) => {
        let lista = [];
        for(var i = 0; i < data.res.rows.length; i++){
          let item = data.res.rows.item(i);
          let conta = {conta: item.conta, saldo: item.saldoConta, percentual: 0};
          lista.push(conta);
        }
        successCallback(lista);

    });
    
  }





}
