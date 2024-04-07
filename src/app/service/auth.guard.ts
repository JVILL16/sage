import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) { 

       
    }




    canActivate(_route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

        return this.authService.isLoggedIn.pipe(take(1), map((isLoggedIn: boolean) => {

                if (sessionStorage.getItem('currentUser') && isLoggedIn) {
                    return true;

                } else {
                    this.router.navigate(['/login']); //, { queryParams: { returnUrl: state.url } }
                    return false;
                }

            })
        );
    }
}