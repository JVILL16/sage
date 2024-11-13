import { Component, OnInit,Input } from '@angular/core';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/service.component';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from 'src/app/service/helpers/loading.service';
import { AuthenticationService } from 'src/app/service/helpers/auth.service';

@Component({
    selector: 'feedback',
    templateUrl: './feedback.component.html',
    styleUrls: ['./feedback.component.css']
})

export class FeedbackComponent implements OnInit {

    @Input() p_name?: any = '';
    @Input() t_name?: any = '';

    logon_email: boolean = false;

    currentUser:any;

    success_alert: boolean = false;
    success_alert_txt: any;

    feedback_obj: any = {
        type: 'Bug',
        title: '',
        request: '',
        email: '',
        p_name: '',
        t_name: ''
    }

    fb_issueTypes: any = ["Feature","Bug","Error","Typo","Other"];

    constructor(private alert: AlertService, private api: ApiService, private load: LoadingService, private auth: AuthenticationService) {
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        
     }

    sendFeedback(): any{
        console.log(this.feedback_obj);
        this.api.createFeedback(this.feedback_obj).subscribe({
            next(response:any){
                this.success_alert = true;
                this.success_alert_txt = response;
                console.log(response);
                setTimeout(()=>{
                    this.success_alert = false;
                    this.success_alert_txt = '';
                    this.feedback_obj = {
                        type: 'Bug',
                        title: '',
                        request: '',
                        email: '',
                        p_name: this.p_name,
                        t_name: this.t_name
                    };
                  },5000);
            },
            error(error:any){
                this.success_alert = false;
                this.alert.error("There was an error processing you feedback: "+error.message);
            }
        });
    }

    ngOnInit(): void {
        console.log(this.p_name);
        console.log(this.currentUser);
        this.feedback_obj.p_name = this.p_name;
        this.feedback_obj.t_name = this.t_name;
        if(this.currentUser[0]){
            this.logon_email = false;
            this.feedback_obj.email = this.currentUser[0]?.email;
        } else
            this.logon_email = false;
    }
}
