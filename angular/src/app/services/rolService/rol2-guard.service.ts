import { Injectable } from '@angular/core';
import { AuthServiceService } from '../authService/auth-service.service';
import { ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Rol2GuardService implements CanActivate {

  constructor(private auth : AuthServiceService, private router : Router) { }

  canActivate(): boolean{
    if(this.auth.getRolUser() === "Usuario") {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }

}
