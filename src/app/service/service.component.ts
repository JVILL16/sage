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
      // 'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Allow-Origin': '*',

    })
  };
  //readonly urlUsersData = 'https://sagejherm.co/api';
  @Output() getLoggedInName: EventEmitter<any> = new EventEmitter();

  dashboard_user: any;
  //create an instance of it through dependency injection within the constructor
  constructor(private httpClient: HttpClient) { }

  //get users data from public api 
  public getUsersData(): Observable<User[]> {

    return this.httpClient.get<User[]>(`${environment.serverUrl}/users/list`);
  }

  public getUser(account: number): Observable<User> {

    return this.httpClient.get<User>(`${environment.serverUrl}/users/user?account=${account}`);
  }
  public getUserProfile(account: number, filename: string) {
    return this.httpClient.get(`${environment.serverUrl}/pfp/download?account=${account}&filename=${filename}`, { responseType: 'blob' });
  }

  public updateUser(user: User): Observable<User> {
    return this.httpClient.post<User>(`${environment.serverUrl}/users/update`, user);
  }

  public uploadImage(image: File, cred: any) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('cred', cred);
    return this.httpClient.post(`${environment.serverUrl}/pfp/upload`, formData);
  }
  //token
  setToken(token: string): any {
    sessionStorage.setItem('token', token);
  }

  getToken(): any {
    return localStorage.getItem('token');
  }

  deleteToken(): any {
    localStorage.removeItem('token');
  }

  isLoggedIn(): any {
    const usertoken = this.getToken();

    if (usertoken != null) {
      console.log(usertoken);
      // return true && this.dashboard_user;
      return true;
    }
    return false;
  }


  //events api
  public getEventsData(profile: any) {
    return this.httpClient.get<any>(`${environment.serverUrl}/events/e_read?profile=${profile}`);
  }
  public createEventData(event: any) {
    return this.httpClient.post<any>(`${environment.serverUrl}/events/e_create`, event);
  }
  public insertGSheetEventData(event: any) {
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/gsheets/e_insert`, event);
  }
  /**
   * 
   * This is for file uploads [TEST] 4/11/24 10:11AM
   * 
   * 
   */
  // upload(file: File): Observable<any> {
  //   const formData: FormData = new FormData();

  //   formData.append('file', file);

  //   return this.httpClient.post(`${environment.serverUrl}/upload`, formData, {
  //     reportProgress: true,
  //     responseType: 'json'
  //   });
  // }

  // getFiles(): Observable<any> {
  //   return this.httpClient.get(`${environment.serverUrl}/files`);
  // }



}
