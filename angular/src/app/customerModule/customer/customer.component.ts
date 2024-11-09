import { Component, OnInit } from '@angular/core';
import { CustomersService } from 'src/app/services/customers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.css'],
})
export class CustomerComponent implements OnInit {
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado

  constructor(
    private customerServices: CustomersService,
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.list();
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });
  }

  list() {
    this.customerServices.getCustomers().subscribe(
      (rs) => {
        this.data = rs;
      },
      (err) => console.log(err)
    );
  }

  heightInfo() {
    let height: number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById('info');

    if (operationsElement)
      operationsElement.style.maxHeight = `${height - 150}px`;
  }
}
