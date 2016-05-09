import {Page, NavController, ViewController, NavParams} from 'ionic-angular';
import {DAOContas} from '../../dao/dao-contas';
import {DataUtil} from '../../util/data-util';

@Page({
  templateUrl: 'build/pages/modal-lancamentos/modal-lancamentos.html',
})

export class ModalLancamentosPage {
  static get parameters() {
    return [[NavController],[ViewController],[NavParams]];
  }

  constructor(nav, view, params) {
    this.daoContas = new DAOContas();
    this.nav = nav;
    this.view = view;
    this.params = params;
    this.daoContas.getList((contas) =>{
      this.contas = contas;
    });

    let datautil = new DataUtil();

    this.lancamento = params.get("parametro") || {};

    this.descricao = this.lancamento.descricao;
    this.valor = this.lancamento.valor;
    this.data = datautil.formatDate(this.lancamento.data);
    console.log(this.data);
    this.conta = this.lancamento.conta;
    this.entradaSaida = this.lancamento.entradaSaida;
    this.pago = this.lancamento.pago;
  }

  cancel(){
    this.view.dismiss();
  }

  salvar(){
    this.lancamento.descricao = this.descricao;
    this.lancamento.valor = parseFloat(this.valor);
    this.lancamento.data = new DataUtil().parseData(this.data);
    this.lancamento.pago = this.pago ? 1 : 0;
    this.lancamento.conta = this.conta;
    this.lancamento.entradaSaida = this.entradaSaida;



    this.view.dismiss(this.lancamento);
  } 
}
