import { Component, OnInit } from '@angular/core';
import { Customers } from '../services/model';
import { CustomersService } from '../services/customers.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-form-customers',
  templateUrl: './form-customers.component.html',
  styleUrls: ['./form-customers.component.css']
})
export class FormCustomersComponent implements OnInit {

  // Inicializar variable
  data : Customers = {
    cliente_id : 0,
    nombre : "",
    direccion: "",
    telefono: "",
    correo: "",
    tipo_cliente: "",
    usuario_registra: "",
    fecha_registra: "",
    usuario_actualiza: "",
    fecha_actualiza: "",
    usuario_id: ""
  };


  constructor(private customerService : CustomersService, private router : Router, private activatedRoute : ActivatedRoute ) { }

  ngOnInit(): void {
    const param = this.activatedRoute.snapshot;
    this.heightInfo();
  }

  save() {
    // Inicializar variable para manejar fecha
    let date_actual : Date = new Date();
    // Obtener valores fecha por separado
    let year : any = date_actual.getFullYear();
    let month : any = date_actual.getMonth() + 1;
    let day : any = date_actual.getDate();
    let hour : any = date_actual.getHours();
    let minute : any = date_actual.getMinutes();
    let seconds : any = date_actual.getSeconds();

    // Agregar ceros cuando es menor a 10
    if (month < 10) month = `0${month}`;
    if (day < 10) day = `0${day}`;
    if (hour < 10) hour = `0${hour}`;
    if (minute < 10) minute = `0${minute}`;
    if (seconds < 10) seconds = `0${seconds}`;

    // Construir formato fecha para poder enviar a API
    let time : string = `${year}-${month}-${day} ${hour}:${minute}:${seconds}`;

    delete this.data.cliente_id;
    this.data.usuario_id = "1"; // Se debe cambiar por el id del usuario que se genera
    this.data.usuario_registra = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.fecha_registra = time;
    this.data.usuario_actualiza = "1"; // Se debe cambiar por el usuario que este logeado (Administrador)
    this.data.fecha_actualiza = time;

    this.customerService.saveCustomer(this.data)
    .subscribe(
      rs => {
        this.router.navigateByUrl("list-customers");
      },
      err => console.log(err)
    )
  }

  heightInfo() {
    let height : number = document.documentElement.clientHeight;

    const operationsElement = document.getElementById("info");

    if (operationsElement) operationsElement.style.maxHeight = `${height - 140}px`;
  }

}
