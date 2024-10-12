import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { FormCustomersComponent } from './form-customers/form-customers.component';
import { LawyerComponent } from './lawyer/lawyer.component';
import { FormLawyerComponent } from './form-lawyer/form-lawyer.component';

const routes: Routes = [
  {
    path : "",
    redirectTo : "/login",
    pathMatch : "full"
  },
  {
    path : "login",
    component : LoginComponent
  },
  {
    path : "list-customers",
    component : CustomerComponent
  },
  {
    path : "new-customer",
    component : FormCustomersComponent
  },
  {
    path : "list-lawyers",
    component : LawyerComponent
  },
  {
    path : "new-lawyer",
    component : FormLawyerComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
