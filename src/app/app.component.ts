import { Component } from '@angular/core';

import { Platform } from 'ionic-angular';

import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';

import { Player } from '../providers/player';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage = HomePage;

  constructor(
    public player: Player,
    public platform: Platform,
    public splashscreen: SplashScreen,
  ) {
    platform.ready().then(() => {
      this.splashscreen.hide();

      this.setPlayer();
    });
  }

  setPlayer() {
    this.player.setDefaultGame();
  }
}
