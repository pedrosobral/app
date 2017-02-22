import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { Storage } from '@ionic/storage';

import { MyApp } from './app.component';

import {
  HomePage,
  QuestionPage,
  EndActivityPage,
} from '../pages/pages';

import { Questions } from '../providers/questions';
import { Player } from '../providers/player';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestionPage,
    EndActivityPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestionPage,
    EndActivityPage,
  ],
  providers: [Storage, { provide: ErrorHandler, useClass: IonicErrorHandler }, Questions, Player]
})
export class AppModule { }
