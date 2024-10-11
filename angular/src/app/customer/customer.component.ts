import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomersService } from '../services/customers.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css']
})
export class CustomerComponent implements OnInit, OnDestroy {

  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";
  private interval_id: any;

  constructor(private customerServices: CustomersService) { }

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    this.interval_id = setInterval(() => { this.isDarkMode = localStorage.getItem("darkMode") === "true"; }, 1);
  }

  ngOnDestroy(): void {
    if (this.interval_id) clearInterval(this.interval_id);
  }

  list() {
    this.customerServices.getCustomers().subscribe(
      rs => {
        this.data = rs;
      },
      err => console.log(err),
    )
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }
}
