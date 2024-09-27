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


  public loginSACC(username:string,password:string): any{
    return this.httpClient.post(`${environment.serverUrl}/auth/sacc`,{username:username,password:password})
  }


}
