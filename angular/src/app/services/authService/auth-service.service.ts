import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthServiceService {

private TOKEN_KEY = 'jwtToken';

  constructor() {}

  // Guarda el token JWT en localStorage
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  // Obtiene el token JWT del localStorage
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Borra el token JWT del localStorage (para logout)
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  // Verifica si el usuario está autenticado basado en el token JWT
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getUser() : string { return localStorage.getItem("nameUser") || "Usuario Indefinido"; }

  getIdUser() : string { return localStorage.getItem("idUser") || "Id Usuario Indefinido";  }

  getRolUser() : string { return localStorage.getItem("rolUser") || "Rol Indefinido"; }

  getPhotoUser() : string { return localStorage.getItem("photoUser") || "Imagen Indefinida"; }
}
