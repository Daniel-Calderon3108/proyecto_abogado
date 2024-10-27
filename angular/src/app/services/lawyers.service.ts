import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lawyers } from './model';

@Injectable({
  providedIn: 'root'
})
export class LawyersService {

  private API_URI : string  = `${origin.replace('4200','8080')}/api/lawyer`;

  constructor(private http : HttpClient) { }

  getLawyers() {
    return this.http.get(`${this.API_URI}`);
  }

  saveLawyer(lawyer : Lawyers) {
    return this.http.post(`${this.API_URI}/register`,lawyer);
  }

  getLawyerByName(name : string) {
    return this.http.get<any[]>(`${this.API_URI}/search/${name}`);
  }

  getLawyerByID(id : number) {
    return this.http.get(`${this.API_URI}/searchById/${id}`);
  }

  getLawyerByDocument(document : string) {
    return this.http.get<any[]>(`${this.API_URI}/searchDocument/${document}`);
  }
}
