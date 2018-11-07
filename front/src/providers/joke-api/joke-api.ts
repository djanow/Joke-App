import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Platform } from "ionic-angular";
import { Observable } from "rxjs/Rx";
import { IJoke } from "../../interface/IJoke";

@Injectable()
export class JokeApiProvider {
  private baseUrl: string = "https://jokeappback.herokuapp.com/joke";

  jokes: IJoke[];

  constructor(
    private readonly http: HttpClient,
    private readonly platform: Platform
  ) {
    console.log("Hello JokeApiProvider Provider");
    if (this.platform.is("cordova") && this.platform.is("android")) {
      this.baseUrl = "https://jokeappback.herokuapp.com/joke";
    }
  }

  getJokes(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  
  rateJoke(id,rate): Observable<any> {
    console.log("post");
    return this.http.put(`${this.baseUrl}`+"/"+id,rate);
  }

}
