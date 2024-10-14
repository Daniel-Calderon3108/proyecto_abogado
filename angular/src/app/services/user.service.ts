import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { session } from './model';
import { session, User } from './model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userUrl = 'http://localhost:8080/api/user/';

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.userUrl}`);
  }
  saveUser(user : User) {
    return this.http.post(`${this.userUrl}register`,user);
  }

  login(session:{ name: string; password: string}): Observable<any> {
    return this.http.post(`${this.userUrl}login`, session);
  }
}
