import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
