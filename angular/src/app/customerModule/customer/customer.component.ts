import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit {

  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";

  constructor(private customerServices: CustomersService, private dataService : DataService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
  }

  list() {
    this.customerServices.getCustomers().subscribe(
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
