import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from '../services/customers.service';
import { DataService } from '../services/shared/data.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {

  idClient : string = "";
  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private activatedRoute : ActivatedRoute, private customerService : CustomersService,
    private dataService : DataService) { }

  ngOnInit(): void {
    this.idClient = this.activatedRoute.snapshot.paramMap.get("id") || "";
    this.customer();
    this.heightInfo();
    
    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  customer() {
    this.customerService.getCustomerByID(parseInt(this.idClient))
    .subscribe(
      rs => {
        this.data = rs;
      },
      err => console.log(err)
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
