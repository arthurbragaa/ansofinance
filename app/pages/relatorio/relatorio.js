import {Page, NavController} from 'ionic-angular';
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
    return [[NavController]];
  }

  constructor(nav) {
    this.nav = nav;
  }
}
