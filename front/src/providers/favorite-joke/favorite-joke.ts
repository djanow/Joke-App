import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { IJoke } from "../../interface/IJoke";

const JOKE_KEY = "joke_";

@Injectable()
export class FavoriteJokeProvider {
  constructor(private storage: Storage) {
    console.log("Hello UserPreferencesProvider Provider");
  }

  addFavoriteJoke(joke: IJoke) {
    this.storage.set(this.getJokeKey(joke), JSON.stringify(joke));
  }

  removeFavoriteJoke(joke: IJoke) {
    this.storage.remove(this.getJokeKey(joke));
  }

  isFavortieJoke(joke: IJoke) {
    return this.storage.get(this.getJokeKey(joke));
  }

  toogleFavoriteJoke(joke: IJoke) {
    this.isFavortieJoke(joke).then(
      isFavorite =>
        isFavorite
          ? this.removeFavoriteJoke(joke)
          : this.addFavoriteJoke(joke)
    );
  }

  getJokeKey(joke: IJoke) {
    return JOKE_KEY + joke.id;
  }

  getFavoriteJokes(): Promise<IJoke[]> {
    return new Promise(resolve => {
      let results: IJoke[] = [];
      this.storage
        .keys()
        .then(keys =>
          keys
            .filter(key => key.includes(JOKE_KEY))
            .forEach(key =>
              this.storage.get(key).then(data => results.push(JSON.parse(data)))
            )
        );
      return resolve(results);
    });
  }
}
