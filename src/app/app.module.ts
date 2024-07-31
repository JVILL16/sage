import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { LoadingService } from './service/helpers/loading.service';
import { ModalsService } from './service/helpers/modals.service';
import { ClutchService } from './service/helpers/clutch.service';
import { ErrorInterceptor } from './service/helpers/error.interceptor';
import { JwtInterceptor } from './service/helpers/jwt.interceptor';
import { AlertService } from './service/helpers/alert.service';
import { AuthenticationService } from './service/helpers/auth.service';

import { ApiService } from './service/service.component';
import { AuthGuard } from './service/auth.guard';
import { AlertComponent } from './service/alert/alert.component';
import { ModalsComponent } from './service/modals/modals.component';
import { LoadingComponent } from './service/loading/loading.component';

import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home-page';
import { NavbarComponent } from './components/navbar/navbar-instant';
import { FooterComponent } from './components/footer/footer-instant';
import { LoginComponent } from './components/login/login-page';
import { AboutComponent } from './components/about/about-page';
import { AdminComponent } from './components/admin/admin-page';
import { RegisterComponent } from './components/register/register-page';
import { ProfileComponent } from './components/profile/profile-page';
import { SectionsComponent } from './components/sections/sections-page';
import { ClutchComponent } from './components/clutch/clutch-page';
import { CalendarComponent } from './components/calendar/calendar.component';
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
    CalendarComponent,
    ClutchComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ModalsComponent
  ],
  providers: [
    AuthGuard,
    ApiService,
    AlertService,
    AuthenticationService,
    ClutchService,
    ModalsService,
    LoadingService,
    // { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    // { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
