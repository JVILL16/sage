import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../service.component';
import { User } from '../../components/users/user';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../alert.service';
import { first } from 'rxjs/operators';
import { AdminComponent } from 'src/app/components/admin/admin-page';

@Component({
    selector: 'app-modal',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css']
})

export class ModalsComponent implements OnInit, OnDestroy {

    // @Input() component_object: any;
    private subscription!: Subscription;
    component_object : any = {};
    // @Input() account_id : any;
    // @Input() profiles : any;
    // @Input() profile_id : any;



    constructor(private admin: AdminComponent) { }

        ngOnInit(): void {
            this.subscription = this.admin.getModalView().subscribe(object => { 
                console.log(object);
                this.component_object = object; 
            });
        }

        ngOnDestroy() {
            this.subscription.unsubscribe();
        }

        auth_RemoveRoleModal(id: number){
            this.admin.auth_RemoveRole(id);
        }
        auth_AddRoleModal(){
            this.admin.auth_AddRole();
        }
}

