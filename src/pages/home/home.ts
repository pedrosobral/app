import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { QuestionPage } from '../pages';

import { Player } from '../../providers/player';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  points: number;

  constructor(
    public player: Player,
    public navCtrl: NavController,
    public navParams: NavParams) {}

  ionViewDidLoad() { }

  ionViewDidEnter() {
    this.player.data.then((data) => {
      this.points = data.points;
      console.info('data', data, this.points);
    });
  }

  goToQuestions(level) {
    this.navCtrl.push(QuestionPage);
  }

}
