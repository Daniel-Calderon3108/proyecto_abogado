import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Case, CaseLawyer } from './model';

@Injectable({
  providedIn: 'root'
})
export class CaseProcessService {

  private API_URI = "http://localhost:8080/api/case";

  constructor(private http : HttpClient) { }

  getCases() {
    return this.http.get(`${this.API_URI}`);
  }

  saveCases(caseProcess : Case) {
    return this.http.post<ApiResponse<number[]>>(`${this.API_URI}/register`, caseProcess);
  }

  getCaseByIdOrName(search : string) {
    return this.http.get<any[]>(`${this.API_URI}/search/${search}`);
  }

  getCaseProcessById(id : number) {
    return this.http.get(`${this.API_URI}/searchById/${id}`);
  }

  addCaseLawyer(caseLawyer : CaseLawyer) {
    return this.http.post(`${this.API_URI}Lawyer/register`,caseLawyer);
  }

  getCaseLawyer() {
    return this.http.get(`${this.API_URI}Lawyer`);
  }

  getCaseLawyerByIdCase(id : number) {
    return this.http.get(`${this.API_URI}Lawyer/search/case/${id}`);
  }
}
