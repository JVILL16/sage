import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable()
export class LoadingService {

    private load = new BehaviorSubject<any>({});
    private miniLoad = new BehaviorSubject<any>({});

    get getLoadStatus() {
        //console.log(this.load);
        return this.load.asObservable();
    }
    get getMiniLoadStatus() {
        //console.log(this.load);
        return this.miniLoad.asObservable();
    }
    constructor(private http: HttpClient) { }

    show(component:any) {
        this.load.next({component:component, status:true});
    }
    hide(component:any) {
        this.load.next({component:component, status:false});
    }
    mini_show(component:any) {
        this.miniLoad.next({component:component, status:true});
    }
    mini_hide(component:any) {
        this.miniLoad.next({component:component, status:false});
    }
   
}