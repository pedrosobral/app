import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { MyApp } from './app.component';

import { HomePage, QuestionPage } from '../pages/pages';

import { Questions } from '../providers/questions';
import { Player } from '../providers/player';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    QuestionPage,
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    QuestionPage,
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, Questions, Player]
})
export class AppModule {}
