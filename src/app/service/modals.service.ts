import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';

import { User } from '../components/users/user';
import { Roles } from '../components/users/roles';

@Injectable()
export class ModalsService {

    private object = new BehaviorSubject<any>({});

    
    get getModalView() {
        console.log(this.object);
        return this.object.asObservable();
    }

    constructor(private http: HttpClient) { }

    getObject(globalObject:any) {
        this.object.next(globalObject);
    }
   
}