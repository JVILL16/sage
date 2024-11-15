import { Component, OnInit,Input } from '@angular/core';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/service.component';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from 'src/app/service/helpers/loading.service';

@Component({
    selector: 'announcement',
    templateUrl: './announce.component.html',
    styleUrls: ['./announce.component.css']
})

export class AnnounceComponent implements OnInit {

    @Input() p_name?: any = [];
    @Input() t_name?: any = [];

    messages: any = [];

    constructor(private alert: AlertService, private api: ApiService, private load: LoadingService) { }


    announceHome(): void{
        this.api.getGroupsAnnounce(this.p_name, this.t_name).subscribe(
            (data: any) => {
              console.log(data);
              this.messages = data.data;
              this.messages.forEach((account: any) => {
                if(!account.pfp || account.pfp=='')
                    account.pfp = 'assets/pfp_default/user.png';
                this.api.getTeamProfiles(account.pfp).subscribe({
                  next: (data: Blob) => {
                    const reader = new FileReader();
                    //console.log(data);
                    reader.onload = () => {
                      account.pfp_url = reader.result as string;
                      //console.log(player.pfp);
                    };
                    reader.readAsDataURL(data);
                  }, error: (error: any) => {
                    //console.error('Error loading profile picture:', error);
                    this.alert.error('Sorry, was not able to load profile picture. ' + error.messsage);
                  }
                });
              });
            },
            (error: any) => {
              this.alert.error('Could not load announcements: ' + error.message);
            });
    }

    ngOnInit(): void {
        this.announceHome();
    }
}
