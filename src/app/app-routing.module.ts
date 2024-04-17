import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home-page';
import { LoginComponent } from './components/login/login-page';
import { AboutComponent } from './components/about/about-page';
//import { state } from '@angular/animations';
import { AuthGuard } from './service/auth.guard';
import { AdminComponent } from './components/admin/admin-page';
import { RegisterComponent } from './components/register/register-page';
import { ClutchComponent } from './components/clutch/clutch-page';
import { ProfileComponent } from './components/profile/profile-page';
import { SectionsComponent } from './components/sections/sections-page';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'about-us', component: AboutComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'clutch', component: ClutchComponent },
  { path: ':username', component: ProfileComponent, canActivate: [AuthGuard],
    children: [
      { path: 'detail/:section', component: SectionsComponent, canActivate: [AuthGuard] },]
  },
  { path: ':username/admin', component: AdminComponent, canActivate: [AuthGuard] },


  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

