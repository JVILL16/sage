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

  public getTeamProfiles(filename: string) {
    return this.httpClient.get(`${environment.serverUrl}/team/dl_t_pfp?filename=${filename}`, { responseType: 'blob' });
  }
  public uploadPlayerImage(image: File, og_pfp:any) {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('og_pfp', og_pfp);
    return this.httpClient.post(`${environment.serverUrl}/team/ul_t_pfp`, formData);
  }
  public getTeamList(section:string,team:string): any{
    return this.httpClient.get<any>(`${environment.serverUrl}/team/read_team?section=${section}&team=${team}`);
  }

  public getAllTeamList(section:string): any{
    return this.httpClient.get<any>(`${environment.serverUrl}/team/read_team?section=${section}`);
  }

  public updateTeamRoster(rostered:any): Observable<any>{
    return this.httpClient.post<any>(`${environment.serverUrl}/team/update_team`, rostered);
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
  public getEventsData(profile: any): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/events/e_read?profile=${profile}`);
  }
  public createEventData(event: any): any {
    return this.httpClient.post<any>(`${environment.serverUrl}/events/e_create`, event);
  }
  public insertGSheetEventData(event: any): any {
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/gsheets/e_insert`, event);
  }

  //links api
  public getLinksData(profile: any): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/links/l_read?profile=${profile}`);
  }
  public createLinkData(event: any): any {
    return this.httpClient.post<any>(`${environment.serverUrl}/links/l_create`, event);
  }
  
  public removeLinkData(id: number): any {
    return this.httpClient.delete(`${environment.serverUrl}/links/l_remove?id=${id}`);
  }


  //feedback api
  public createFeedback(feedback:any) : any {
    return this.httpClient.post<any>(`${environment.serverUrl}/feedback/fb_create`, feedback);
  }
  public getGroupsFeedbacks(profile:any, team:any) : any {
    return this.httpClient.get<any>(`${environment.serverUrl}/feedback/fb_read?profile=${profile}&team=${team}`);
  }
  public getSectionsFeedbacks(profile:any) : any {
    return this.httpClient.get<any>(`${environment.serverUrl}/feedback/fb_read?profile=${profile}`);
  }

  //announcement api
  public createAnnounce(announce:any) : any {
    return this.httpClient.post<any>(`${environment.serverUrl}/announcements/announce_create`, announce);
  }
  public getGroupsAnnounce(profile:any, team:any) : any {
    return this.httpClient.get<any>(`${environment.serverUrl}/announcements/announce_read?profile=${profile}&team=${team}`);
  }
  public getSectionsAnnounce(profile:any) : any {
    return this.httpClient.get<any>(`${environment.serverUrl}/announcements/announce_read?profile=${profile}`);
  }
  public removeAnnounceData(id: number): any {
    return this.httpClient.delete(`${environment.serverUrl}/announcements/announce_remove?id=${id}`);
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
