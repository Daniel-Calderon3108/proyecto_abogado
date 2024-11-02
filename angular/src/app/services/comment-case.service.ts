import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, CommentCase } from './model';

@Injectable({
  providedIn: 'root'
})
export class CommentCaseService {

  private API_URI : string = `${origin.replace('4200','8080')}/api/commentCase/`;

  constructor(private http : HttpClient) { }

  getCommentsCaseById(id : string) {
    return this.http.get<CommentCase>(`${this.API_URI}${id}`);
  }

  saveComment(comment : CommentCase, edit : boolean, id : string) {
    if(edit) {
      return this.http.put<ApiResponse<null>>(`${this.API_URI}update/${id}`, comment);
    }
    return this.http.post<ApiResponse<null>>(`${this.API_URI}register`, comment);
  }

  changeImportance(id : string, comment : CommentCase) {
    return this.http.put<ApiResponse<null>>(`${this.API_URI}update/important/${id}`, comment);
  }

  deleteComment(id : string) {
    return this.http.delete<ApiResponse<null>>(`${this.API_URI}delete/${id}`);
  }
}
