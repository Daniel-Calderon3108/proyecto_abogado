import { Document } from './model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = "http://localhost:8080/api/documents/";

  constructor(private http : HttpClient) { }

  getDocument() {
    return this.http.get(`${this.apiUrl}listDocument`);
  }

  saveDocument(document : Document) {
    return this.http.post(`${this.apiUrl}register`,document);
  }

  getDocumentById(id : number) {
    return this.http.get(`${this.apiUrl}listDocument/${id}`);
  }
}
