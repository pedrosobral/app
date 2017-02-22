import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-end-activity',
  templateUrl: 'end-activity.html'
})
export class EndActivityPage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.info('params', this.navParams);
  }


}
