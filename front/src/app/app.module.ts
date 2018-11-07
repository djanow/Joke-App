import { IonicStorageModule } from "@ionic/storage";
import { HttpClientModule } from "@angular/common/http";
import { JokeDetailPageModule } from "../pages/joke-detail/joke-detail.module";
import { JokeListPageModule } from "../pages/joke-list/joke-list.module";
import { MyJokesPageModule } from "../pages/my-jokes/my-jokes.module";
import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, NgModule } from "@angular/core";
import { IonicApp, IonicErrorHandler, IonicModule } from "ionic-angular";

import { MyApp } from "./app.component";

import { StatusBar } from "@ionic-native/status-bar";
import { SplashScreen } from "@ionic-native/splash-screen";
import { JokeApiProvider } from "../providers/joke-api/joke-api";
import { FavoriteJokeProvider } from "../providers/favorite-joke/favorite-joke";

@NgModule({
  declarations: [MyApp],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    MyJokesPageModule,
    JokeListPageModule,
    JokeDetailPageModule,
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [MyApp],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    JokeApiProvider,
    FavoriteJokeProvider
  ]
})
export class AppModule {}
