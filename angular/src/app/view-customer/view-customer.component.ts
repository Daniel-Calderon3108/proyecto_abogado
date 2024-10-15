import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {

  idClient : string = "";

  constructor(private activatedRoute : ActivatedRoute, private customerService : CustomersService) { }

  ngOnInit(): void {
    this.idClient = this.activatedRoute.snapshot.paramMap.get("id") || "";
    this.customer(parseInt(this.idClient));
  }

  customer(id : number) {

  }

}
