import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { QuestionPage } from '../pages';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams) {}

  ionViewDidLoad() { }

  goToQuestions(level) {
    this.navCtrl.push(QuestionPage);
  }

}
