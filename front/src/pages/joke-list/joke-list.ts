import { JokeApiProvider } from "../../providers/joke-api/joke-api";
import { JokeDetailPage } from "../joke-detail/joke-detail";
import { IJoke } from "../../interface/IJoke";
import { Component } from "@angular/core";
import { IonicPage, NavController, NavParams } from "ionic-angular";
import { ViewChild } from '@angular/core';
import { Slides } from 'ionic-angular';

@IonicPage()
@Component({
  selector: "page-joke-list",
  templateUrl: "joke-list.html"
})
export class JokeListPage {
  jokes = new Array<IJoke>();
  
  @ViewChild('choice') slider: Slides;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private jokeApiProvider: JokeApiProvider
  ) {}

  ionViewDidLoad() {
    this.jokeApiProvider.getJokes().subscribe(data => {
      this.jokes = data;
    });
  }

  goToDetail(joke: IJoke) {
    this.navCtrl.push(JokeDetailPage, joke);
  }


  removeJoke(joke){
    let index = this.jokes.indexOf(joke);

    if(index > -1){
      this.jokes.splice(index, 1);
    }
  }
  
  slideChanged(joke) {
    try{
     let currentIndex = this.slider.getActiveIndex();
     if(this.slider.isBeginning())
     {
        console.log("not like"+joke._id);
        this.jokeApiProvider.rateJoke(joke._id,{ thumbDown: joke.thumbDown+1, creator: '5be2a4946f06ef30c08942a2', password:'7989jm1.'}).subscribe(data => {
          this.removeJoke(joke);
          console.log(data);
        });;
        // thumbs up
     }
     else if(this.slider.isEnd())
     {
        console.log("like");
        
        this.jokeApiProvider.rateJoke(joke._id,{ thumbUp: joke.thumbUp+1, creator: '5be2a4946f06ef30c08942a2', password:'7989jm1.'}).subscribe(data => {
          this.removeJoke(joke);
          console.log(data);
        });;
     // thumb down
     }
     
    }catch(e){
      console.log("onSlideChanged ex", e)
    }
 }
}
