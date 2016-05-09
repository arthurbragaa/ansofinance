import {Page, Modal, NavController, Alert, Events} from 'ionic-angular';
import {Toast} from 'ionic-native';
import {ModalLancamentosPage} from '../modal-lancamentos/modal-lancamentos';
import {DAOLancamentos} from '../../dao/dao-lancamentos';
import {DataUtil} from '../../util/data-util';
import {DataFilter} from '../../components/data-filter';
import {RelatorioPage} from '../relatorio/relatorio';

@Page({
  templateUrl: 'build/pages/lancamentos/lancamentos.html',
  directives: [DataFilter]
})
export class LancamentosPage {
  static get parameters() {
    return [[NavController], [Events]];
  }

  constructor(nav, events) {
    this.dao = new DAOLancamentos();
    this.nav = nav;
    this.events = events;
    this.listaLancamentos = [];
    this.dataFiltro = new Date();
    this.getListaLancamentos();
  }

  getListaLancamentos(){
    let dataUtil = new DataUtil();
    let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
    let dataFim = dataUtil.getLastDay(this.dataFiltro);

    this.dao.getList(dataInicio, dataFim, (lista) => {
      this.listaLancamentos = lista;
    });
  }

  insert(){
    let modal = Modal.create(ModalLancamentosPage);
    
    modal.onDismiss((data) => {
      if(data) {
        this.dao.insert(data, (lancamento) => {
          this.updateMonth(new Date(lancamento.data));
          Toast.showShortBottom("Lançamento adicionado com sucesso").subscribe(
            (toast) => {
              console.log(toast);
            });
        });
      }
    });

    this.nav.present(modal);
  }

  edit(item){
    let modal = Modal.create(ModalLancamentosPage, {parametro: item});
    modal.onDismiss((data) => {
      if(data) {
        this.dao.edit(data, (lancamento) => {
          this.updateMonth(new Date(lancamento.data));
          Toast.showShortBottom("Lançamento alterado com sucesso").subscribe(
            (toast) => {
              console.log(toast);
            });
        });
      }
    });
    this.nav.present(modal);
  }

  delete(lancamento){
    let confirm = Alert.create({
      title: "Excluir",
      body: "Gostaria realmente de excluir o lançamento " + lancamento.descricao + " ?",
      buttons: [
        {
          text: "Sim",
          handler: () =>{
            this.dao.delete(lancamento, (lancamento) => {
              let pos = this.listaLancamentos.indexOf(lancamento);
              this.getListaLancamentos(this.dataFiltro);
              Toast.showShortBottom("Lançamento excluído com sucesso").subscribe(
                (toast) => {
                  console.log(toast);
                });
            });
          }
        },
        {
          text: "Não"
        }
      ]
    });
    this.nav.present(confirm);
  }

  getDate(lancamento) {
    let dataUtil = new DataUtil();
    return dataUtil.parseString(lancamento.data);
  }

  situacaoLancamento(lancamento){
    return lancamento.pago ? "Pago" : "Não pago";
  }

  lancamentoEntrada(lancamento){
    return lancamento.entradaSaida == "entrada";
  }

  updateMonth(data){
    this.dataFiltro = data;
    this.getListaLancamentos();
    this.updateSaldo();
  }

  updateSaldo(){
    this.dao.getSaldo((saldo) => {
      this.events.publish("saldo:updated", saldo);
    });
  }

  paymentButtonText(lancamento){
      return lancamento.pago ? "Reabrir": "Pagar";
  }

  changePaymentStatus(lancamento){
    let dataUtil = new DataUtil();
    lancamento.pago = lancamento.pago ? 0 : 1;
    lancamento.data = new Date(lancamento.data);
    this.dao.edit(lancamento, (lancamento) => {
      this.updateMonth(new Date(lancamento.data));
    });
  }

  onClickMonth(){
    this.nav.push(RelatorioPage, {"parametro": this.dataFiltro});
  }

}
