import { FavoriteJokeProvider } from "../../providers/favorite-joke/favorite-joke";
import { IJoke } from "../../interface/IJoke";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";

@IonicPage()
@Component({
  selector: "page-joke-detail",
  templateUrl: "joke-detail.html"
})
export class JokeDetailPage {
  joke: IJoke;
  isFavorite: boolean = false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private favoriteJokeProvider: FavoriteJokeProvider
  ) {}

  ionViewDidLoad() {
    this.joke = this.navParams.data;
    this.favoriteJokeProvider
      .isFavortieJoke(this.joke)
      .then(value => (this.isFavorite = value));
  }

  toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.favoriteJokeProvider.toogleFavoriteJoke(this.joke);
  }
}
