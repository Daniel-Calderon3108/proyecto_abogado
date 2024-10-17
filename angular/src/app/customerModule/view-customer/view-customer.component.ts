import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomersService } from 'src/app/services/customers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css']
})
export class ViewCustomerComponent implements OnInit {

  idClient : string = "";
  data: any = [];
  isDarkMode: boolean = localStorage.getItem("darkMode") === "true";
  isCase : boolean = false;

  constructor(private activatedRoute : ActivatedRoute, private customerService : CustomersService,
    private dataService : DataService) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe(params => {
       this.idClient = params.get("id") || "";
       this.customer();
      }
    )
    this.heightInfo();
    
    this.dataService.currentDarKMode.subscribe( value => { this.isDarkMode = value; });
    
  }

  customer() {
    this.customerService.getCustomerByID(parseInt(this.idClient))
    .subscribe(
      rs => {
        this.data = rs
        this.isCase = this.data.caseProcess?.length <= 0;
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
