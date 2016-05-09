import {App, Platform} from 'ionic-angular';
import {StatusBar} from 'ionic-native';
import {HomePage} from './pages/home/home';
import {ContasPage} from './pages/contas/contas';
import {SaldoPage} from './pages/saldo/saldo';

@App({
  templateUrl: 'build/app.html',
  config: { mode: "md" } // http://ionicframework.com/docs/v2/api/config/Config/
})
export class MyApp {
  static get parameters() {
    return [[Platform]];
  }

  constructor(platform) {
    this.home = HomePage;
    this.contas = ContasPage;
    this.saldo = SaldoPage;
    this.raiz = this.home;


    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
    });
  }

  openPage(opcao){
    console.log(opcao);
    this.raiz = opcao;
  }





}
