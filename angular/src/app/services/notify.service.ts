import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Notify } from './model';

@Injectable({
  providedIn: 'root'
})
export class NotifyService {

  private API_URI : string = `${origin.replace('4200','8080')}/api/notify/`;

  constructor(private http : HttpClient) { }

  getNotifyByUser(id : string) {
    return this.http.get<Notify[]>(`${this.API_URI}${id}`);
  }

  checkNotify(id : string, notify : Notify) {
    return this.http.put<ApiResponse<null>>(`${this.API_URI}update/view/${id}`, notify);
  }

  createNotify(notify : Notify, id : number = 0) {
    return this.http.post<ApiResponse<null>>(`${this.API_URI}register/${id}`, notify);
  }
}