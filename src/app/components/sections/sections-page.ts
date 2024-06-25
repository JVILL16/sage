import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../users/user';
import { AuthenticationService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/service.component';
import { ActivatedRoute, Router, ParamMap, NavigationStart } from '@angular/router';
import { ClutchService } from 'src/app/service/helpers/clutch.service';
import { AlertService } from 'src/app/service/alert.service';


@Component({
    selector: 'sections-page',
    templateUrl: './sections-page.html',
    styleUrls: ['./sections-page.css']
  })

export class SectionsComponent implements OnInit{
   
  
    section: any;
    sectionRoute: any;
    clutch_attendence : any;
    clutch_events : any;

    constructor(private auth: AuthenticationService,
      private activatedRoute: ActivatedRoute, 
      private api: ApiService,
      private router: Router,
      private alert: AlertService,
    private clutch: ClutchService) {
       
    }

    

    ngOnInit() {
      // this.router.events.subscribe(event => {
      //   if (event instanceof NavigationStart) {
      //     if (event.navigationTrigger === 'popstate') {
      //       console.log(event);
      //       this.section = 'overview';
      //     }
      //   }
      // });
      this.sectionRoute = this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.section = params.get('section'); 
        console.log(this.section);
      if(this.section == 'clutch')
        this.clutchSection();
      else if(this.section == 'admin')
        this.adminSection();
      else if(this.section == 'settings')
        this.settingsSection();
      else
        this.alert.error("This section is unavailable or under maintaince, please select a different section", this.section);
      })

      
    }

    
    clutchSection() : void {

      this.clutch.getClutchData('practice').subscribe(
        (data:any) => {
          this.clutch_attendence = data;
          console.log(this.clutch_attendence); // Handle the data as needed
        },
        (error:any) => {
          this.alert.error('Error fetching Google Sheets data:', error);
        }
      );;
      this.api.getEventsData('179925').subscribe(
        (data:any) => {
          this.clutch_events = data;
          console.log(this.clutch_events); // Handle the data as needed
        },
        (error:any) => {
          this.alert.error('Error fetching Events for Clutch:', error.error);
        }
      );;
    }

    settingsSection() : void{
      console.log(this.section);
    }
    adminSection(): void{
      console.log(this.section);
    }
}