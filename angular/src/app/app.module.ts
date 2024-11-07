import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './userModule/login/login.component';
import { CustomerComponent } from './customerModule/customer/customer.component';
import { FormCustomersComponent } from './customerModule/form-customers/form-customers.component';
import { LawyerComponent } from './lawyerModule/lawyer/lawyer.component';
import { FormLawyerComponent } from './lawyerModule/form-lawyer/form-lawyer.component';
import { UserComponent } from './userModule/user/user.component';
import { FormUserComponent } from './userModule/form-user/form-user.component';
import { HomeComponent } from './home/home.component';
import { CaseProcessComponent } from './caseProcessModule/case-process/case-process.component';
import { FormCaseProcessComponent } from './caseProcessModule/form-case-process/form-case-process.component';
import { FormDocumentComponent } from './documentModule/form-document/form-document.component';
import { ListDocumentComponent } from './documentModule/list-document/list-document.component';
import { ViewCustomerComponent } from './customerModule/view-customer/view-customer.component';
import { ViewLawyerComponent } from './lawyerModule/view-lawyer/view-lawyer.component';
import { ViewCaseComponent } from './caseProcessModule/view-case/view-case.component';
import { ViewUserComponent } from './userModule/view-user/view-user.component';
import { ViewDocumentComponent } from './documentModule/view-document/view-document.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CustomerComponent,
    FormCustomersComponent,
    LawyerComponent,
    FormLawyerComponent,
    UserComponent,
    FormUserComponent,
    HomeComponent,
    CaseProcessComponent,
    FormCaseProcessComponent,
    FormDocumentComponent,
    ListDocumentComponent,
    ViewCustomerComponent,
    ViewLawyerComponent,
    ViewCaseComponent,
    ViewUserComponent,
    ViewDocumentComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
