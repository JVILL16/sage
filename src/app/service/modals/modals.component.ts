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
import { ModalsService } from '../modals.service';
import { ClutchService } from '../helpers/clutch.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css']
})

export class ModalsComponent {

    // @Input() component_object: any;
    private subscription!: Subscription;
    component_object: any;

    listAdd: any = [];

    attending:boolean= false;
    attend:any;
    // @Input() account_id : any;
    // @Input() profiles : any;
    // @Input() profile_id : any;



    constructor(private modalService: ModalsService, private auth: AuthenticationService, private clutch: ClutchService) {
        this.modalService.getModalView.subscribe((data: any) => {
            console.log(data);
            this.component_object = data;
            console.log(this.component_object);
        });
    }

    clutch_EventAttendModal(status_obj: any) {
        if (this.attending)
            this.attend = "Yes";
        else
            this.attend = "No";
        this.clutch.updateClutchEventData(status_obj.User, status_obj.Status.Date.toLocaleDateString(), this.attend).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
    }

    auth_RemoveRoleModal(id: number) {
        this.auth.removerole(id).subscribe({
            next(data: any) {
                console.log(data);
            },
            error(error: any) {
                console.log(error);
            }
        });
    }
    auth_AddRoleModal() {
        for (var profile of this.component_object.profiles)
            if (profile.checked) this.listAdd.push(profile.profile_id);
        this.auth.rolesregister(this.component_object.account_id, this.listAdd)
            .pipe(first())
            .subscribe({
                next(data) {
                    console.log(data);
                },
                error(error) {
                    console.log(error);
                }
            });
    }
}

