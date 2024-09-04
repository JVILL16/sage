import { Injectable, inject } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthenticationService } from './helpers/auth.service';
import { Observable } from 'rxjs';
import { take, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private authService: AuthenticationService) {  }




    canActivate(_route: ActivatedRouteSnapshot, _state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authService.isLoggedIn.pipe(take(1), map((isLoggedIn: boolean) => {

                if (sessionStorage.getItem('currentUser') && isLoggedIn) {
                    return true;

                } else {
                    this.router.navigate(['/login']);
                    //this.router.navigate([_state.url]); //, { queryParams: { returnUrl: state.url } }
                    return false;

                    // // Allow access to NotFoundComponent without authentication
                    // if (state.url === '/404') {
                    //     return true;
                    // } else {
                    //     this.router.navigate(['/login']);
                    //     return false;
                    // }
                }

            })
        );
    }
}