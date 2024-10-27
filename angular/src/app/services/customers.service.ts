import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customers } from './model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private API_URI : string  = `${origin.replace('4200','8080')}/api/customer`;

  constructor(private http : HttpClient) { }

  getCustomers() {
    return this.http.get(`${this.API_URI}`);
  }

  saveCustomer(customer : Customers) {
    return this.http.post(`${this.API_URI}/register`, customer);
  }

  getCustomerByName(name : string) {
    return this.http.get<any[]>(`${this.API_URI}/search/${name}`);
  }

  getCustomerByID(id : number) {
    return this.http.get(`${this.API_URI}/searchById/${id}`);
  }

  getCustomerByDocument(document : string) {
    return this.http.get<any[]>(`${this.API_URI}/searchDocument/${document}`);
  }
}
