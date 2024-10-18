import { EventEmitter, Output, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../components/users/user';

import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class KickballService {

  //create an instance of it through dependency injection within the constructor
  constructor(private httpClient: HttpClient) { }

  public getKBUser(kickball_id:number): any{
    return this.httpClient.get<any>(`${environment.serverUrl}/auth/sacc/kb_user?kb_id=${kickball_id}`);
  }

  public updateKBUser(kb_userinfo:any,kickball_id:number): any {
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/sacc/kb_update`,{username:kb_userinfo?.username,password:kb_userinfo?.password,kb_id:kickball_id});
  }
  
  public loginSACC(username:string,password:string): any{
    return this.httpClient.post(`${environment.serverUrl}/auth/sacc/sacc`,{username:username,password:password})
  }

  public getKBTeamInfo(url:string): any {
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/sacc/sacc_team`,{url:url});
  }
  public getKBScheduleInfo(url:string): any{
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/sacc/sacc_schedule`,{url:url});
  }

  public getKBStatistics(): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/auth/gsheets/kickball/Ballers2024.json`);
  }
}
