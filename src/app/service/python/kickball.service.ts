import { EventEmitter, Output, Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../../components/users/user';

import { environment } from 'src/environments/environment';

import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  //create an instance of it through dependency injection within the constructor
  constructor(private httpClient: HttpClient) { }

  //get users data from public api 
  public getUsersData(): Observable<User[]> {

    return this.httpClient.get<User[]>(`${environment.serverUrl}/users/list`);
  }


}
