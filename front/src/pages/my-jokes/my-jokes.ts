import { FavoriteJokeProvider } from "../../providers/favorite-joke/favorite-joke";
import { JokeDetailPage } from "../joke-detail/joke-detail";
import { IJoke } from "../../interface/IJoke";
import { JokeListPage } from "../joke-list/joke-list";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-my-jokes",
  templateUrl: "my-jokes.html"
})
export class MyJokesPage {
  favoriteJokes: IJoke[];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private favoriteJokeProvider: FavoriteJokeProvider
  ) {}

  ionViewDidLoad() {
    console.log("ionViewDidLoad MyJokesPage");
  }

  ionViewWillEnter() {
    this.initFavoriteJokes();
  }

  initFavoriteJokes() {
    this.favoriteJokeProvider
      .getFavoriteJokes()
      .then(favs => (this.favoriteJokes = favs));
  }

  findJoke() {
    this.navCtrl.push(JokeListPage);
  }

  goToDetail(joke: IJoke) {
    this.navCtrl.push(JokeDetailPage, joke);
  }
}
