import { Document } from './model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  
  private API_URI = `${origin.replace('4200','8080')}/api/documents/`;

  constructor(private http : HttpClient) { }

  getDocument() {
    return this.http.get(`${this.API_URI}listDocument`);
  }

  saveDocument(document : Document) {
    return this.http.post(`${this.API_URI}register`,document);
  }

  getDocumentById(id : number) {
    return this.http.get(`${this.API_URI}listDocument/${id}`);
  }
}
