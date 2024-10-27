import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { session, User } from './model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URI : string = `${origin.replace('4200','8080')}/api/user/`;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.API_URI}`);
  }
  saveUser(user : User) {
    return this.http.post(`${this.API_URI}register`,user);
  }

  login(session:{ name: string; password: string}): Observable<any> {
    return this.http.post(`${this.API_URI}login`, session);
  }

  getUserByName(name : string) {
    return this.http.get<any[]>(`${this.API_URI}search/${name}`);
  }
}
