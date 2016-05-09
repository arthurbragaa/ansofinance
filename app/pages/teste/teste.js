import {Page} from 'ionic-angular';

@Page({
    templateUrl: 'build/pages/teste/teste.html'
})

export class TestePage{
    constructor(){
        
    }

    testandoMetodo() {
        return "Consigo criar um método em ionic 2";
    }
}
