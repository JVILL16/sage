import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../service.component';
import { User } from '../../components/users/user';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../helpers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../helpers/alert.service';
import { first, map } from 'rxjs/operators';
import { AdminComponent } from 'src/app/components/admin/admin-page';
import { ModalsService } from '../helpers/modals.service';
import { ClutchService } from '../helpers/clutch.service';


import { JsonPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css'],
    standalone: true,
    imports: [NgbDatepickerModule, FormsModule, JsonPipe, CommonModule]
})

export class ModalsComponent {

    // @Input() component_object: any;
    private subscription!: Subscription;
    component_object: any;

    listAdd: any = [];



    attending: boolean = false;
    attend: any;

    model: NgbDateStruct | undefined;
    modelList: Array<NgbDateStruct> = [];


    event_Submit: boolean = false;


    // @Input() account_id : any;
    // @Input() profiles : any;
    // @Input() profile_id : any;



    constructor(private modalService: ModalsService, private api: ApiService, private auth: AuthenticationService, private clutch: ClutchService) {
        this.modalService.getModalView.subscribe((data: any) => {
            //console.log(data);
            this.component_object = data;
        });
    }

    closeModal() { this.modalService.getReset(true); this.modelList = [] };
    //right here i have to make a call from modal service to sections page wheere the object is stored since that is the only way to reset it
    //closeAddEventModal = () => this.component_object = { name:'', dates: '', location:'', description:'', p_name:'' } && (this.modelList = []);
    dp_isSelected(date: any) {
        // console.log(this.modelList.indexOf(date));
        // console.log(this.modelList);
        //return this.modelList.indexOf(date) >= 0;
        return this.modelList.some((d: any) => d.equals(date));
    };
    dp_selectOne(date: any) {
        //console.log(date);
        // console.log(this.modelList.indexOf(date));
        if (this.dp_isSelected(date)) {
            this.modelList = this.modelList.filter((ele: any) => !ele.equals(date));
        } else {
            this.modelList.push(date);
        }
        console.log(this.modelList);
    }

    clutch_AddEvent() {
        this.event_Submit = true;
        this.modelList.map((d:any)=>{
            //.padStart(2, '0')
            const day = String(d.day);
            const month = String(d.month);
            const year = String(d.year);
            const date =  `${month}/${day}/${year};`;
            if (date !== undefined && date !== null) {
                this.component_object.dates += date;
            }
            
        });
        this.component_object.dates.replace(/;$/, '');
        //console.log(this.component_object);
        this.api.createEventData(this.component_object).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
        this.api.insertGSheetEventData(this.component_object).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
        this.closeModal();
        setTimeout(()=>{

            this.event_Submit = false;
      
          },5000);
        
       
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
                next(data: any) {
                    console.log(data);
                },
                error(error: any) {
                    console.log(error);
                }
            });
    }
}

