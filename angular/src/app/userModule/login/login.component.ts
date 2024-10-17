
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { session } from 'src/app/services/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  // Aqui debe de estar la logica para verificar el usuario y contraseña
  // Crear sesion cuando el usuario se haya autenticado

  constructor(private router : Router, private userService: UserService) { }

  // Variables para el login
  session: Partial<session> = {
    name: '',
    password: ''
  }
  // Mensajes de login
  errMessage: string = '';
  resMessage: string = '';

  // Método para manejar el login
  onSubmitLogin() {
    this.errMessage = '';
    this.resMessage = '';

    if (!this.session.name || !this.session.password) {
      this.errMessage = 'Por favor, complete todos los campos.';
      return;
    }

    this.userService.login(this.session as { name: string; password: string}).subscribe({
      next: (res) => {
        console.log('Respuesta del login:', res);
        if (res.success) {
          this.resMessage = res.message || 'Inicio de sesión exitoso';
          // Redirigir a la página de lista de clientes
          this.router.navigateByUrl('home');
        } else {
          this.resMessage = res.message || 'Error de autenticación';
        }
      },
      error: (err) => {
        this.resMessage = 'Error de autenticación. Verifica tus credenciales';
        console.error('Error durante el login:', err);
      }
    });
  }

  /*login() {
    this.router.navigateByUrl("list-customers");
    // Provisional, para redirigir al listado de clientes temporal "(click)="login()"
  }*/
}