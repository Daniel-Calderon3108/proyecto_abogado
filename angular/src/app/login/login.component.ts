import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Aqui debe de estar la logica para verificar el usuario y contraseña
  // Crear sesion cuando el usuario se haya autenticado

  constructor(private router : Router) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigateByUrl("list-customers");
    // Provisional, para redirigir al listado de clientes
  }
}
