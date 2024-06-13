import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';


@Injectable({ providedIn: 'root' })
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey: string = "fVDrUMzCn4z23XAZg85DVkx2E1tGbw0J";
  private serviceURL : string = "https://api.giphy.com/v1/gifs";

  constructor ( private http: HttpClient ) {
    this.loadLocalStorage();
  }

  get tagsHistory() { //getter
    return [...this._tagsHistory];
  }

  private organizeHistory( tag: string ): void {
    tag = tag.toLowerCase(); //Pasar a minuscula

    if (this._tagsHistory.includes( tag )){
        this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag!== tag )
    } //Eliminar si ya existe antes

    this._tagsHistory.unshift(tag); //Insertar
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage():void {
    if (! localStorage.getItem('history')) return; //Si no hay informacion no hace nada

    this._tagsHistory = JSON.parse ( localStorage.getItem('history')! );

    if (this._tagsHistory.length === 0 ) return;
    this.searchTag (this._tagsHistory[0]);
  }

  searchTag(tag: string): void {  //Buscar

    if (tag.length === 0 ) return; 
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key', this.apiKey )
      .set('limit', '10')
      .set('q', tag )

    this.http.get<SearchResponse>(`${ this.serviceURL }/search`, { params })
      .subscribe( resp => {

        this.gifList = resp.data;
        // console.log({ gifs: this.gifList });

      });
    
    
  }
}