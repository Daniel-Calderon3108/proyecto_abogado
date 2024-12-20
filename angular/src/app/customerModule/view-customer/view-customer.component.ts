import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthServiceService } from 'src/app/services/authService/auth-service.service';
import { CustomersService } from 'src/app/services/customers.service';
import { Customers } from 'src/app/services/model';
import { DataService } from 'src/app/services/shared/data.service';
import { TimeActualService } from 'src/app/services/time-actual/time-actual.service';

@Component({
  selector: 'app-view-customer',
  templateUrl: './view-customer.component.html',
  styleUrls: ['./view-customer.component.css'],
})
export class ViewCustomerComponent implements OnInit {
  idClient: string = '';
  data: any = [];
  currentTheme: string = localStorage.getItem('theme') || ''; // Cargar el tema desde localStorage o usar "light" como predeterminado
  isCase : boolean = false;
  statusActual : boolean = true;
  @ViewChild("status") status! : ElementRef;
  @ViewChild("lastUpdate") lastUpdate! : ElementRef;
  @ViewChild("userUpdate") userUpdate! : ElementRef;

  rolUser : string = this.auth.getRolUser();
  imageUrl : SafeUrl | null = null;

  constructor(private activatedRoute : ActivatedRoute, private customerService : CustomersService,
    private dataService : DataService, private time : TimeActualService, 
    private router : Router, private renderer : Renderer2, private auth : AuthServiceService,
    private sanitizer : DomSanitizer, private http : HttpClient) { }

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((params) => {
      this.idClient = params.get('id') || '';
      this.customer();
    });
    this.heightInfo();

    // Suscribirse al tema actual del servicio
    this.dataService.currentTheme.subscribe((value) => {
      this.currentTheme = value;
    });
  }

  customer() {
    this.customerService.getCustomerByID(parseInt(this.idClient)).subscribe(
      (rs) => {
        this.data = rs;
        this.isCase = this.data.caseProcess?.length <= 0;
        if (rs.user.photoUser !== 'Ninguna') {
          const url = `${origin.replace('4200', '8080')}/api/user/searchPhoto/${rs.user.photoUser}`;
          this.http.get(url, { responseType: 'blob' }).subscribe(
            rs => { 
              const imageUrl = URL.createObjectURL(rs);
              this.imageUrl = this.sanitizer.bypassSecurityTrustResourceUrl(imageUrl);
            },
            err => console.log(err)
          );
        } else {
          this.imageUrl = 'assets/no-user.webp';
        }
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

  editCustomer() {
    this.router.navigate(['edit-customer', this.data.idClient]);
  }

  changeStatus() {
    let customer : Customers = {
      updateUserClient: this.auth.getUser(),
      dateUpdateClient: this.time.getTime(),
      user: {
        userUpdate : this.auth.getUser(),
        lastUpdate: this.time.getTime()
      }
    }

    this.customerService.changeStatus(this.data.idClient, customer).subscribe(
      (rs) => {
        if (rs.success == true) {
          this.statusActual = !this.statusActual;
          let status = this.statusActual ? "Activo" : "Inactivo";
          this.renderer.setProperty(this.status.nativeElement, 'innerHTML', status);
          this.renderer.setProperty(this.lastUpdate.nativeElement, 'innerHTML', this.time.getTime());
          this.renderer.setProperty(this.userUpdate.nativeElement, 'innerHTML', this.auth.getUser());
          this.dataService.changeMessage(true, `Se cambio el estado a ${status.toLowerCase()} con exito.`);
        } else {
          console.log(rs.message);
        }
      },
      (err) => console.log('Hubo un error al cambiar el estado' + err)
    );
  }
}
