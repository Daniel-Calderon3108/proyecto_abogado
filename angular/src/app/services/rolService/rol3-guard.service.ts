import { Injectable } from '@angular/core';
import { AuthServiceService } from '../authService/auth-service.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class Rol3GuardService implements CanActivate {

  constructor(private auth: AuthServiceService, private router : Router) { }

  canActivate() : boolean {
    if (this.auth.getRolUser() !== "Administrador") {
      this.router.navigate(['/home']);
      return false;
    }
    
    return true;
  }
}
