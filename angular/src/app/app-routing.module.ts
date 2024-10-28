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
    canActivate: [AuthGuardService]
  },
  {
    path : "list-users",
    component : UserComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "new-user",
    component : FormUserComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "edit-user/:id",
    component : FormUserComponent,
    canActivate: [AuthGuardService]
  },
  // Cliente
  {
    path : "list-customers",
    component : CustomerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "new-customer",
    component : FormCustomersComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "customer/:id",
    component: ViewCustomerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path: "edit-customer/:id",
    component : FormCustomersComponent,
    canActivate: [AuthGuardService]
  },
  // Abogado
  {
    path : "list-lawyers",
    component : LawyerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "new-lawyer",
    component : FormLawyerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "lawyer/:id",
    component : ViewLawyerComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "edit-lawyer/:id",
    component : FormLawyerComponent,
    canActivate: [AuthGuardService]
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
    canActivate: [AuthGuardService]
  },
  {
    path : "case/:id",
    component : ViewCaseComponent,
    canActivate: [AuthGuardService]
  },
  // Documentos
  {
    path : "list-document",
    component : ListDocumentComponent,
    canActivate: [AuthGuardService]
  },
  {
    path : "new-document",
    component : FormDocumentComponent,
    canActivate: [AuthGuardService]
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
