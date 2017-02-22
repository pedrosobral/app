import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { HomePage } from '../home/home';

import { Player } from '../../providers/player';

@Component({
  selector: 'page-end-activity',
  templateUrl: 'end-activity.html'
})
export class EndActivityPage {
  points = this.navParams.get('points');

  constructor(public player: Player, public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {
    console.info('params', this.navParams);

    this.player.data.then((data) => {
      data.points += this.points;
      this.player.save(data);
    });
  }

  dismiss() {
    this.navCtrl.setRoot(HomePage);
  }

}
