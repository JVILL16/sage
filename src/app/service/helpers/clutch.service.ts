import { Output, Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClutchService {

  constructor(private httpClient: HttpClient) { }

  //google sheets api
  public getClutchData(view:string): any {
    return this.httpClient.get<any>(`${environment.serverUrl}/auth/gsheets/read?view=${view}`);
  }

 


}
