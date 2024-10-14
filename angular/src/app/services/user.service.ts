import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URI : string = "http://localhost:8080/api/user";

  constructor(private http : HttpClient) { }

  getUsers() {
    return this.http.get(`${this.API_URI}`);
  }

  saveUser(user : User) {
    return this.http.post(`${this.API_URI}/register`,user);
  }
}
