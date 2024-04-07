import { EventEmitter, Output, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../components/users/user';
import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',

    })
  };
  //readonly urlUsersData = 'https://sagejherm.co/api';
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  dashboard_user : any;
  //create an instance of it through dependency injection within the constructor
  constructor(private httpClient: HttpClient) { }

  //get users data from public api 
  public getUsersData() : Observable<User[]> {
 
    return this.httpClient.get<User[]>(`${environment.serverUrl}/users/read`);
  }
  // public userlogin(username: string, password: string) : Observable<Users[]> {
  //   return this.httpClient.post<Users[]>(`${environment.serverUrl}/auth/login`, { username, password })
  //     .pipe(map(Users => {
  //       //this.setToken(Users[0].username);
  //       this.dashboard_user = Users[0];
  //       this.getLoggedInName.emit(true);
  //       return Users;
  //     }));
  // }

  // public userregistration(username:string,email:string,password:string,first_name:string,last_name:string): Observable<Users> {
    
  //   return this.httpClient.post<Users>(`${environment.serverUrl}/auth/register`, { username,email, password,first_name,last_name })
  //       .pipe(map(Users => {
  //           return Users;
  //       }));
  // }

//token
setToken(token: string) : any {
  localStorage.setItem('token', token);
}
 
getToken() : any {
  return localStorage.getItem('token');
}
 
deleteToken() : any {
  localStorage.removeItem('token');
}
 
isLoggedIn() : any {
  const usertoken = this.getToken();

  if (usertoken != null) {
    console.log(usertoken);
   // return true && this.dashboard_user;
   return true;
  }
  return false;
}

    
}
