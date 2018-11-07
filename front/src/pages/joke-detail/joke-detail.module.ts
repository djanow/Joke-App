import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { JokeDetailPage } from './joke-detail';

@NgModule({
  declarations: [
    JokeDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(JokeDetailPage),
  ],
})
export class JokeDetailPageModule {}
