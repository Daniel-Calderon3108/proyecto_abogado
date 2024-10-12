import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Lawyers } from './model';

@Injectable({
  providedIn: 'root'
})
export class LawyersService {

  private API_URI : string  = "http://localhost:8080/";

  constructor(private http : HttpClient) { }

  getLawyers() {
    return this.http.get(`${this.API_URI}Lawyers`);
  }

  saveLawyer(lawyer : Lawyers) {
    return this.http.post(`${this.API_URI}newLawyer`,lawyer);
  }
}
