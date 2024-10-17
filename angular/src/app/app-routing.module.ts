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
    path : "user/:name",
    component : ViewUserComponent
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
    path: "customer/:id",
    component: ViewCustomerComponent
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
    path : "lawyer/:id",
    component : ViewLawyerComponent
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
  },
  {
    path : "case/:id",
    component : ViewCaseComponent
  },
  {
    path : "list-document",
    component : ListDocumentComponent
  },
  {
    path : "new-document",
    component : FormDocumentComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
