import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';


@Injectable()
export class ModalsService {

    private object = new BehaviorSubject<any>({});
    private resetObject = new BehaviorSubject<boolean>(false);
    private refreshPage = new BehaviorSubject<any>('');

    
    get getModalView() {
        console.log(this.object);
        return this.object.asObservable();
    }

    get getResetModalObj() {
        return this.resetObject.asObservable();
    }

    get getRefreshPage() {
        return this.refreshPage.asObservable();
    }

    constructor(private http: HttpClient) { }

    getObject(globalObject:any) {
        this.object.next(globalObject);
    }

    getReset(check:any){
        this.resetObject.next(check);
    }

    getRefresh(refresh:any){
        this.refreshPage.next(refresh);
    }
}