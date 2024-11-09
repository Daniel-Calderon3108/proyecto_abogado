import { Document, ApiResponse } from './model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  private API_URI = `${origin.replace('4200', '8080')}/api/documents`;

  constructor(private http: HttpClient) {}

  getDocument() {
    return this.http.get(`${this.API_URI}/files`);
  }

  saveDocument(formData: FormData, edit: boolean, id: string) {
    if (edit) {
      return this.http.put<ApiResponse<number[]>>(
        `${this.API_URI}/update/${id}`,
        formData
      );
    }
    return this.http.post<ApiResponse<number[]>>(
      `${this.API_URI}/register`,
      formData
    );
  }

  getDocumentById(id: number) {
    return this.http.get<Document>(`${this.API_URI}/searchById/${id}`);
  }

  getDocumentByCase(id : number) {
    return this.http.get<Document[]>(`${this.API_URI}/searchByCase/${id}`);
  }
}
