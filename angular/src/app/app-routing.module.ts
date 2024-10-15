import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { CustomerComponent } from './customer/customer.component';
import { FormCustomersComponent } from './form-customers/form-customers.component';
import { LawyerComponent } from './lawyer/lawyer.component';
import { FormLawyerComponent } from './form-lawyer/form-lawyer.component';
import { UserComponent } from './user/user.component';
import { FormUserComponent } from './form-user/form-user.component';
import { HomeComponent } from './home/home.component';
import { CaseProcessComponent } from './case-process/case-process.component';
import { FormCaseProcessComponent } from './form-case-process/form-case-process.component';

const routes: Routes = [
  {
    path : "",
    redirectTo : "/login",
    pathMatch : "full"
  },
  {
    path : "home",
    component : HomeComponent
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
  },
  {
    path : "list-users",
    component : UserComponent
  },
  {
    path : "new-user",
    component : FormUserComponent
  },
  {
    path : "list-cases",
    component : CaseProcessComponent
  },
  {
    path : "new-case",
    component : FormCaseProcessComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
