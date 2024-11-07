import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiResponse, Customers } from './model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private API_URI : string  = `${origin.replace('4200','8080')}/api/customer`;

  constructor(private http : HttpClient) { }

  getCustomers() {
    return this.http.get(`${this.API_URI}`);
  }

  saveCustomer(customer : Customers, edit : boolean, id : string) {
    if(edit) {
      return this.http.put<ApiResponse<null>>(`${this.API_URI}/update/${id}`,customer);
    }
    return this.http.post<ApiResponse<null>>(`${this.API_URI}/register`, customer);
  }

  getCustomerByName(name : string) {
    return this.http.get<Customers[]>(`${this.API_URI}/search/${name}`);
  }

  getCustomerByID(id : number) {
    return this.http.get<Customers>(`${this.API_URI}/searchById/${id}`);
  }

  getCustomerByDocument(document : string) {
    return this.http.get<Customers>(`${this.API_URI}/searchDocument/${document}`);
  }

  changeStatus(id : string, customer : Customers) {
    return this.http.put<ApiResponse<null>>(`${this.API_URI}/changeStatus/${id}`,customer);
  }

  getByUser(id : number) {
    return this.http.get<ApiResponse<null>>(`${this.API_URI}/searchByUser/${id}`);
  }
}
