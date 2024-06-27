import { Output, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClutchService {

  constructor(private httpClient: HttpClient) { }

  //google sheets api
  public getClutchUserData(view:string,user:string): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/auth/gsheets/read?view=${view}&user=${user}`);
  }

  public getClutchData(view:string): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/auth/gsheets/read?view=${view}`);
  }
 

  public updateClutchEventData(user:string,date:string,status:string){
    return this.httpClient.post<any>(`${environment.serverUrl}/auth/gsheets/update`, { user,date,status});
  }


}
