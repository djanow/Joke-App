import { NgModule } from "@angular/core";
import { IonicPageModule } from "ionic-angular";
import { JokeListPage } from "./joke-list";

@NgModule({
  declarations: [JokeListPage],
  imports: [IonicPageModule.forChild(JokeListPage)]
})
export class JokeListPageModule {}
