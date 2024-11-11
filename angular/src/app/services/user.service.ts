import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiResponse, session, User } from './model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API_URI : string = `${origin.replace('4200','8080')}/api/user/`;

  constructor(private http: HttpClient) { }

  getUsers() {
    return this.http.get(`${this.API_URI}`);
  }

  saveUser(user : User, edit : boolean, id : string) {
    if(edit) {
      return this.http.put<ApiResponse<null>>(`${this.API_URI}update/${id}`,user);
    }
    return this.http.post<ApiResponse<null>>(`${this.API_URI}register`,user);
  }

  login(session:{ name: string; password: string}) {
    return this.http.post<ApiResponse<User>>(`${this.API_URI}login`, session);
  }

  getUserByName(name : string) {
    return this.http.get<ApiResponse<User>>(`${this.API_URI}search/${name}`);
  }

  changeStatus(id : string, user : User) {
    return this.http.put<ApiResponse<null>>(`${this.API_URI}changeStatus/${id}`,user);
  }

  getUserById(id : string) {
    return this.http.get<User>(`${this.API_URI}searchById/${id}`);
  }

  uploadPhoto(formData : FormData) {
    return this.http.post<ApiResponse<null>>(`${this.API_URI}uploadPhoto`, formData);
  }
}
