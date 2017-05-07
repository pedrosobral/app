import { NgModule, ErrorHandler } from '@angular/core';

import { BrowserModule } from '@angular/platform-browser';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { IonicStorageModule } from '@ionic/storage';

import { SplashScreen } from '@ionic-native/splash-screen';

import { HttpModule } from '@angular/http';

import { MyApp } from './app.component';

import {
  HomePage,
  QuestionPage,
} from '../pages/pages';

import { Questions } from '../providers/questions';
import { Player } from '../providers/player';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestionPage,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestionPage,
  ],
  providers: [SplashScreen, { provide: ErrorHandler, useClass: IonicErrorHandler }, Questions, Player]
})
export class AppModule { }
