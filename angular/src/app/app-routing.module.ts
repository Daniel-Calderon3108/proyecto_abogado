import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './userModule/login/login.component';
import { HomeComponent } from './home/home.component';
import { CaseProcessComponent } from './caseProcessModule/case-process/case-process.component';
import { FormCaseProcessComponent } from './caseProcessModule/form-case-process/form-case-process.component';
import { ViewCaseComponent } from './caseProcessModule/view-case/view-case.component';
import { CustomerComponent } from './customerModule/customer/customer.component';
import { FormCustomersComponent } from './customerModule/form-customers/form-customers.component';
import { ViewCustomerComponent } from './customerModule/view-customer/view-customer.component';
import { FormDocumentComponent } from './documentModule/form-document/form-document.component';
import { ListDocumentComponent } from './documentModule/list-document/list-document.component';
import { FormLawyerComponent } from './lawyerModule/form-lawyer/form-lawyer.component';
import { LawyerComponent } from './lawyerModule/lawyer/lawyer.component';
import { ViewLawyerComponent } from './lawyerModule/view-lawyer/view-lawyer.component';
import { FormUserComponent } from './userModule/form-user/form-user.component';
import { UserComponent } from './userModule/user/user.component';
import { ViewUserComponent } from './userModule/view-user/view-user.component';
import { AuthGuardService } from './services/authService/auth-guard.service';
import { RolGuardService } from './services/rolService/rol-guard.service';
import { Rol2GuardService } from './services/rolService/rol2-guard.service';
import { Rol3GuardService } from './services/rolService/rol3-guard.service';

const routes: Routes = [
  {
    path : "",
    redirectTo : "/login",
    pathMatch : "full"
  },
  {
    path : "home",
    component : HomeComponent,
    canActivate : [AuthGuardService]
  },
  {
    path : "login",
    component : LoginComponent
  },
  // Usuario
  {
    path : "user/:name",
    component : ViewUserComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "list-users",
    component : UserComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "new-user",
    component : FormUserComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "edit-user/:id",
    component : FormUserComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  // Cliente
  {
    path : "list-customers",
    component : CustomerComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "new-customer",
    component : FormCustomersComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path: "customer/:id",
    component: ViewCustomerComponent,
    canActivate: [AuthGuardService, RolGuardService]
  },
  {
    path: "edit-customer/:id",
    component : FormCustomersComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  // Abogado
  {
    path : "list-lawyers",
    component : LawyerComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "new-lawyer",
    component : FormLawyerComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "lawyer/:id",
    component : ViewLawyerComponent,
    canActivate: [AuthGuardService, RolGuardService, Rol2GuardService]
  },
  {
    path : "edit-lawyer/:id",
    component : FormLawyerComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  // Casos
  {
    path : "list-cases",
    component : CaseProcessComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "new-case",
    component : FormCaseProcessComponent,
    canActivate: [AuthGuardService, Rol3GuardService]
  },
  {
    path : "case/:id",
    component : ViewCaseComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "edit-case/:id",
    component : FormCaseProcessComponent,
    canActivate : [AuthGuardService, Rol2GuardService]
  },
  // Documentos
  {
    path : "list-document",
    component : ListDocumentComponent,
    canActivate: [AuthGuardService, Rol2GuardService]
  },
  {
    path : "new-document",
    component : FormDocumentComponent,
    canActivate: [AuthGuardService, Rol2GuardService]
  },
  {
    path: "**",
    redirectTo: "/home"
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
