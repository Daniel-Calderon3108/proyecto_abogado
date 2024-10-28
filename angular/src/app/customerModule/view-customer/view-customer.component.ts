import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomersService } from 'src/app/services/customers.service';
import { Customers } from 'src/app/services/model';
import { DataService } from 'src/app/services/shared/data.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';

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
  statusActual : boolean = true;
  @ViewChild("status") status! : ElementRef;
  @ViewChild("lastUpdate") lastUpdate! : ElementRef;

  constructor(private activatedRoute : ActivatedRoute, private customerService : CustomersService,
    private dataService : DataService, private time : TimeActualService, 
    private router : Router, private renderer : Renderer2) { }

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

  editCustomer() { this.router.navigate(['edit-customer', this.data.id_client]) }

  changeStatus() {
    let customer : Customers = {
      updateUserClient: "Administrador",
      dateUpdateClient: this.time.getTime(),
      user: {
        userUpdate : "Administrador",
        lastUpdate: this.time.getTime()
      }
    }

    this.customerService.changeStatus(this.data.id_client, customer).subscribe(
      rs => {
        if(rs.success == true) {
          this.statusActual = !this.statusActual;
          let status = this.statusActual ? "Activo" : "Inactivo";
          this.renderer.setProperty(this.status.nativeElement, 'innerHTML', status);
          this.renderer.setProperty(this.lastUpdate.nativeElement, 'innerHTML', this.time.getTime());
        } else {
          console.log(rs.message)
        }
      },
      err => console.log("Hubo un error al cambiar el estado" + err)
    );
  }
}
