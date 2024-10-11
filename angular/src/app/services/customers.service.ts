import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Customers } from './model';

@Injectable({
  providedIn: 'root'
})
export class CustomersService {

  private API_URI : string  = "http://localhost:8080/";

  constructor(private http : HttpClient) { }

  getCustomers() {
    return this.http.get(`${this.API_URI}Customers`);
  }

  saveCustomer(customer : Customers) {
    return this.http.post(`${this.API_URI}newCustomer`, customer);
  }
}
