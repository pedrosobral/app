import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EndActivityPage } from './end-activity';

@NgModule({
  declarations: [
    EndActivityPage,
  ],
  imports: [
    IonicPageModule.forChild(EndActivityPage),
  ],
  exports: [
    EndActivityPage
  ]
})
export class EndActivityPageModule {}
