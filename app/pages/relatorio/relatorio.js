import {Page, NavController, NavParams} from 'ionic-angular';
import {DataUtil} from '../../util/data-util';
import {DAOLancamentos} from '../../dao/dao-lancamentos';

/*
  Generated class for the RelatorioPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/relatorio/relatorio.html',
})
export class RelatorioPage {
  static get parameters() {
    return [[NavController], [NavParams]];
  }

  constructor(nav, params) {
    this.nav = nav;
    this.dao = new DAOLancamentos();
    this.entradaSaida = "entrada";

    this.dataFiltro = params.get("parametro");
    this.getList(this.entradaSaida);
  }

  getList(entradaSaida){
    let dataUtil = new DataUtil();

    let dataInicio = dataUtil.getFirstDay(this.dataFiltro);
    let dataFim = dataUtil.getLastDay(this.dataFiltro);

    this.dao.getListGroupByConta(dataInicio, dataFim, entradaSaida, (listaContas) => {
      this.listaContas = listaContas;
      this.calcPercentual();
      console.log(this.listaContas);
    });
  }

  calcTotal(){
    let total = 0;
    for(var i = 0; i < this.listaContas.length; i++){
      total += this.listaContas[i].saldo;
    }
    return total; 
  }

  calcPercentual() {
    let total = this.calcTotal();
    for(var i = 0; i < this.listaContas.length; i++){
      this.listaContas[i].percentual = (this.listaContas[i].saldo / total) * 100;
    }
  }

  onSelect(entradaSaida){
    this.getList(entradaSaida);
  }
}
