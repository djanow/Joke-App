import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyJokesPage } from './my-jokes';

@NgModule({
  declarations: [
    MyJokesPage,
  ],
  imports: [
    IonicPageModule.forChild(MyJokesPage),
  ],
})
export class MyJokesPageModule {}
