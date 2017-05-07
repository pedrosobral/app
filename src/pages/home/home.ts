import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';

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
    public navParams: NavParams,
    public alertCtrl: AlertController
  ) {}

  ionViewDidLoad() { }

  ionViewDidEnter() {
    this.player.data.then((data) => {
      this.points = data.points;
    });
  }

  goToQuestions(level, points) {
    if (this.points >= points) {
      this.navCtrl.push(QuestionPage);
    } else {
      this.showAlert(`Vc precisa de pelos menos ${points} XP para ter acesso a essas questões`);
    }
  }

  goToBonus(points) {
    if (this.points >= points) {
      this.navCtrl.push('BonusPage');
    } else {
      this.showAlert(`Vc precisa de pelos menos ${points} XP para ter acesso a esse treinamento`);
    }
  }

  showAlert(msg) {
    const alert = this.alertCtrl.create({
      title: 'Ops! Consquite mais XPs',
      subTitle: msg,
      buttons: ['Entendi']
    });
    alert.present();
  }



}
