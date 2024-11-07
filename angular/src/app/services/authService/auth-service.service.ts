import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

  constructor() { }

  isAuthenticated() : boolean {
    return !!localStorage.getItem("nameUser");
  }

  getUser() : string { return localStorage.getItem("nameUser") || "Usuario Indefinido"; }

  getIdUser() : string { return localStorage.getItem("idUser") || "Id Usuario Indefinido";  }

  getRolUser() : string { return localStorage.getItem("rolUser") || "Rol Indefinido"; }
}
