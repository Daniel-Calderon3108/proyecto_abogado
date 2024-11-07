import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { CaseProcessService } from 'src/app/services/case-process.service';
import { CustomersService } from 'src/app/services/customers.service';
import { LawyersService } from 'src/app/services/lawyers.service';
import { DataService } from 'src/app/services/shared/data.service';

@Component({
  selector: 'app-case-process',
  templateUrl: './case-process.component.html',
  styleUrls: ['./case-process.component.css'],
})
export class CaseProcessComponent implements OnInit {
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado
  idView : number = 0;
  rolUser : string = this.auth.getRolUser();

  constructor(private casesService: CaseProcessService, private dataService: DataService, private auth : AuthServiceService,
            private customerService : CustomersService, private lawyerService : LawyersService) {}

  ngOnInit(): void {
    if(this.rolUser === 'Usuario') this.searchCustomer();
    if(this.rolUser === 'Abogado') this.searchLawyer();
    if(this.rolUser === 'Administrador') this.list();
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });
  }

  list() {

    this.casesService.getCases(this.rolUser, this.idView).subscribe(
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
      operationsElement.style.maxHeight = `${height - 140}px`;
  }

  searchCustomer() {
    this.customerService.getByUser(parseInt(this.auth.getIdUser())).subscribe(
      rs => {
        this.idView = parseInt(rs.singleData);
        this.list();
      },
      err => console.log(err)
    )
  }

  searchLawyer() {
    this.lawyerService.getByUser(parseInt(this.auth.getIdUser())).subscribe(
      rs => {
        this.idView = parseInt(rs.singleData);
        this.list();
      },
      err => console.log(err)
    )
  }
}
