import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../../components/users/user';
import { Roles } from '../../components/users/roles';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthenticationService {

    private loggedIn = new BehaviorSubject<boolean>(false);
    private checkAdmin = new BehaviorSubject<boolean>(false);
    private userName = new BehaviorSubject<string>('');
    private userEmail = new BehaviorSubject<string>('');


    currentUser: any;
    get isLoggedIn() {
        return this.loggedIn.asObservable();
    }
    get isAdmin() {
        return this.checkAdmin.asObservable();
    }
    get getUsername() {
        return this.userName.asObservable();
    }

    constructor(private http: HttpClient, private alertService:AlertService, private router: Router) { }

    userlogin(username: string, password: string): Observable<any> {
        return this.http.post<any>(`${environment.serverUrl}/auth/login`, { username: username, password: password })
            .pipe(map(user => {
                console.log(user?.status);
                // login successful if there's a jwt token in the response
                if (user?.status===200) { //&& user.token
                    this.router.navigate(['/']);
                    // store user details and jwt token in session storage to keep user logged in between page refreshes
                    sessionStorage.setItem('currentUser', JSON.stringify(user?.data));
                    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
                    this.loggedIn.next(true);
                    this.checkAdmin.next(this.currentUser[0]?.roles.some((role:any)=> role.profile_id === 231385));
                    this.userName.next(this.currentUser[0]?.username);
                    
                } else {
                    this.router.navigate(['/']);
                    this.alertService.error('Login failed try again and refresh');
                }


                return user;
            }));
    }

 

    userregistration(username: string, email: string, password: string, first_name: string, last_name: string, phone:string,roles:any, pfp:any): Observable<User> {

        return this.http.post<User>(`${environment.serverUrl}/auth/register`, { username, email, password, first_name, last_name, phone, roles, pfp})
            .pipe(map(user => {
                return user;
            }));
    }

    userdelete(id:number){
        return this.http.delete<User>(`${environment.serverUrl}/auth/remove?account_id=${id}`);
    }

    rolesregister(account_id: number,roles: any): Observable<Roles> {
        return this.http.post<Roles>(`${environment.serverUrl}/users/roles/add`, { account_id, roles })
          .pipe(map(Roles => {
            
            return Roles;
          }));
      }
      removerole(id: number): any {
    
        return this.http.delete(`${environment.serverUrl}/users/roles/rmv_role?id=${id}`);
      }
      getProfileData(): Observable<Roles[]> {
        return this.http.get<Roles[]>(`${environment.serverUrl}/users/profile/list`);
      }


    logout() {
        // remove user from session storage to log user out
        this.loggedIn.next(false);
        this.checkAdmin.next(false);
        this.userName.next('');
        sessionStorage.removeItem('currentUser');
    }
}