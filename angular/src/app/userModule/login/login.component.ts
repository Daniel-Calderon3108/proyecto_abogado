
import { Component, ElementRef, ViewChild } from '@angular/core';
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
    name: localStorage.getItem("nameRemember") || "",
    password: localStorage.getItem("passRemember") || ""
  }
  // Mensajes de login
  errMessage: string = '';
  resMessage: string = '';

  @ViewChild('name') inputName! : ElementRef;
  isFocusName : boolean = false;
  @ViewChild('password') inputPassword! : ElementRef;
  isFocusPassword : boolean = false;
  remember : boolean = localStorage.getItem("nameRemember") != null;

  // Método para manejar el login
  onSubmitLogin() {
    this.errMessage = '';
    this.resMessage = '';

    // Validar que los campos de nombre y clave no esten vacios
    if (!this.session.name || !this.session.password) {
      this.errMessage = 'Por favor, complete todos los campos.';
      if (!this.session.name) { // Si el campo vacio es nombre
        this.inputName.nativeElement.focus(); // Dar focus
        this.isFocusName = true;
        this.isFocusPassword = false;
      } else if (!this.session.password) { // Si el campo vacio es clave
        this.inputPassword.nativeElement.focus(); // Dar focus
        this.isFocusName = false;
        this.isFocusPassword = true;
      }
      return;
    }

    this.isFocusName = false;
    this.isFocusPassword = false;

    this.userService.login(this.session as { name: string; password: string}).subscribe({
      next: (res) => {
        if (res.success) {
          this.resMessage = res.message || 'Inicio de sesión exitoso';
          // Si el usuario selecciona recuerda me
          // Se crea un localstorage donde se almacena nombre y clave
          if (this.remember) {
            localStorage.setItem("nameRemember", this.session.name || "");
            localStorage.setItem("passRemember", this.session.password || "");
          } else {
            localStorage.removeItem("nameRemember");
            localStorage.removeItem("passRemember");
          }
          this.router.navigate(['/home']); // Redireccionar a la pagina de inicio
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
}