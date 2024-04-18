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
      { path: '', redirectTo: 'detail/overview', pathMatch: 'full' },
      { path: 'detail/:section', component: SectionsComponent, canActivate: [AuthGuard] }]
  },
  


  // otherwise redirect to home
  { path: '**', redirectTo: '' }

];


// function getMillis(hours: number) {
//   return hours * 60 * 60 * 100;
// }

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],

  //This looks good for any future stuff that I want for night and day types (including getMillis function)

  // providers: [
  //   {
  //     provide: ROUTES,
  //     useFactory: () => {
  //       let routes: Routes = [];
  //       const currentTime = new Date().getTime();

  //       if (currentTime < getMillis(6) || currentTime > getMillis(18)) {
  //         routes.push({
  //           path: 'night',
  //           component: NightComponent
  //         });
  //       }
  //       else {
  //         routes.push({
  //           path: 'day',
  //           component: DayComponent
  //         });
  //       }

  //       if (Math.random() < 0.5) {
  //         routes.push({
  //           path: 'secret',
  //           component: TopSecretComponent
  //         });
  //       }

  //       return [
  //         ...routes,
  //         ...standardRoutes
  //       ];
  //     },
  //     multi: true
  //   }
  // ]
})
export class AppRoutingModule { }

