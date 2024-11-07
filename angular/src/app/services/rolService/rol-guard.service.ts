import { Injectable } from '@angular/core';
import { AuthServiceService } from '../authService/auth-service.service';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CustomersService } from '../customers.service';
import { LawyersService } from '../lawyers.service';

@Injectable({
  providedIn: 'root'
})
export class RolGuardService implements CanActivate {

  constructor(private auth: AuthServiceService, private router: Router,
    private customerService: CustomersService, private lawyerService: LawyersService) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (this.auth.getRolUser() === "Usuario") {
      this.customerService.getByUser(parseInt(this.auth.getIdUser())).subscribe(
        rs => {
          if (rs.success) {
            const idCustomer = rs.singleData;
            const routerId = route.paramMap.get("id");

            if (idCustomer === routerId) {
              return true;
            }
          }
          this.router.navigate(['/home']);
          return false;
        },
        err => {
          console.log(err);
          this.router.navigate(['/home']);
          return false;
        }
      )
    }

    if (this.auth.getRolUser() === "Abogado") {
      this.lawyerService.getByUser(parseInt(this.auth.getIdUser())).subscribe(
        rs => {
          if (rs.success) {
            const idLawyer = rs.singleData;
            const routerId = route.paramMap.get("id");

            if (idLawyer === routerId) {
              return true;
            }
          }
          this.router.navigate(['/home']);
          return false;
        },
        err => {
          console.log(err);
          this.router.navigate(['/home']);
          return false;
        }
      )
    }

    return true;
  }
}
