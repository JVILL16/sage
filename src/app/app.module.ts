import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home-page';
import { NavbarComponent } from './components/navbar/navbar-instant';
import { FooterComponent } from './components/footer/footer-instant';
import { LoginComponent } from './components/login/login-page';
import { AboutComponent } from './components/about/about-page';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoadingComponent } from './components/loading/loading.component';
import { ApiService } from './service/service.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AlertService } from './service/alert.service';
import { AuthenticationService } from './service/auth.service';
import { AuthGuard } from './service/auth.guard';
import { JwtInterceptor } from './service/helpers/jwt.interceptor';
import { AdminComponent } from './components/admin/admin-page';
import { RegisterComponent } from './components/register/register-page';
import { ProfileComponent } from './components/profile/profile-page';
import { ErrorInterceptor } from './service/helpers/error.interceptor';
import { AlertComponent } from './service/alert/alert.component';
import { SectionsComponent } from './components/sections/sections-page';
import { ModalsComponent } from './service/modals/modals.component';
import { ModalsService } from './service/modals.service';
import { ClutchService } from './service/helpers/clutch.service';
import { ClutchComponent } from './components/clutch/clutch-page';
import { NotFoundComponent } from './not-found.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AdminComponent,
    RegisterComponent,
    LoginComponent,
    AboutComponent,
    NavbarComponent,
    FooterComponent,
    LoadingComponent,
    AlertComponent,
    ProfileComponent,
    SectionsComponent,
    ModalsComponent,
    ClutchComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [
    AuthGuard,
    ApiService,
    AlertService,
    AuthenticationService,
    ClutchService,
    AdminComponent,
    ModalsService,
    LoadingComponent,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
