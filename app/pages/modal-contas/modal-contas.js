import {Page, ViewController, NavParams} from 'ionic-angular';

/*
  Generated class for the ModalContasPage page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Page({
  templateUrl: 'build/pages/modal-contas/modal-contas.html',
})
export class ModalContasPage {
  static get parameters(){
    return [[ViewController], [NavParams]];
  }

  constructor(view, params) {
    this.view = view;
    this.params = params;

    this.conta = params.get("parametro") || {descricao: ""};
  }

  cancel(){
    this.view.dismiss();
  }

  salvar(){
    this.view.dismiss(this.conta);
  } 

}
