import { Component, OnInit,Injectable,Output, HostBinding, EventEmitter } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { first } from 'rxjs/operators';
import { ModalsComponent } from '../../service/modals/modals.component';
import { ModalsService } from 'src/app/service/modals.service';


@Component({
    selector: 'admin-page',
    templateUrl: './admin-page.html',
    styleUrls: ['./admin-page.css']
})

export class AdminComponent implements OnInit {
    display_id: string = '';
    display_show: boolean = false;
    user_first_name: any;
    currentUser: User[];
    users: User[] = [];

    acc_id: any;
    profileList: any = [];
    profileAddList: any = [];
    rmv_role_id: any;

    constructor(private api: ApiService,
        private auth: AuthenticationService,
        private router: Router,
    private alertService: AlertService,
private modalService: ModalsService) {

        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        //console.log(this.currentUser[0]);
        //this.user_first_name = this.currentUser[0].first_name;
    }

    roleDisplayButton(uid: any) {
        this.display_id = 'roles_display' + uid;
        this.display_show = !this.display_show;
    }


    ngOnInit() {
        this.getUsers();
    }

    loggingOut() {
        this.auth.logout();
    }

    deleteUser(id: any) {
        this.auth.userdelete(id).subscribe({
            next: data => {
                console.log(data);
                this.getUsers();
                //this.status = 'Delete successful';
            },
            error: error => {
                //this.errorMessage = error.message;
                console.error('There was an error!', error);
            }
        })
    }

    getUsers() {

        this.api.getUsersData().subscribe((res: User[]) => {
            //console.log(res);
            this.users = res;
            console.log(this.users);

        });
        
        this.home_GetProfile();

    }

    home_GetProfile(): void {
        this.auth.getProfileData().subscribe({
            next: (response) => {
                this.profileList = response.map(v => ({ ...v, checked: false }));
                console.log(this.profileList);
            },
            error: (error) => {
                console.log(error);
                this.alertService.error(error);
            }

        });
    }

    addRole(roles: any) {
        //console.log(roles.roles);
        this.acc_id = roles.account_id;
        this.profileAddList = this.profileList.filter((p: any) => !roles.roles.some((r: any) => p.profile_id === r.profile_id));
        //console.log(this.profileAddList);
       this.modalService.getObject({view:'admin',account_id: this.acc_id, profiles: this.profileAddList, profile_id: null});
    }
    
    removeRole(id: number) {
        this.rmv_role_id = id;
        this.modalService.getObject({view:'admin',account_id: null, profiles: null, profile_id: this.rmv_role_id});
    }




   
}