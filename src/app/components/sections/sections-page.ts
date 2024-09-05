import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../users/user';
import { AuthenticationService } from '../../service/helpers/auth.service';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/service.component';
import { ActivatedRoute, Router, ParamMap, NavigationStart } from '@angular/router';
import { ClutchService } from 'src/app/service/helpers/clutch.service';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { ModalsService } from 'src/app/service/helpers/modals.service';


@Component({
  selector: 'sections-page',
  templateUrl: './sections-page.html',
  styleUrls: ['./sections-page.css']
})

export class SectionsComponent implements OnInit {

  currentUser: any;

  section: any;
  sectionRoute: any;

  section_id: any;

  clutch_attend: any;
  clutch_events: any;
  clutch_name: any;
  clutch_admin: boolean = false;

  eventData: any = {
    name: '',
    dates: '',
    location: '',
    description: '',
    p_name: ''
  }

  constructor(private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private alert: AlertService,
    private clutch: ClutchService,
    private modalService: ModalsService) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.clutch_name = this.currentUser[0].first_name + " " + this.currentUser[0].last_name;
    this.modalService.getResetModalObj.subscribe((data: any) => {
      //console.log(data);
      if (data) {
        this.eventData = {
          name: '',
          dates: '',
          location: '',
          description: '',
          p_name: this.section_id
        }
      }
      //this.modalService.getReset(false);
    });
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
      sessionStorage.setItem('nav_section', this.section);
      if (this.section == 'overview')
        this.overviewSection();
      else if (this.section == 'clutch')
        this.clutchSection();
      else if (this.section == 'grocery')
        this.grocerySection();
      else if (this.section == 'kickball')
        this.kickballSection();
      else if (this.section == 'admin')
        this.adminSection();
      else if (this.section == 'settings')
        this.settingsSection();
      else
        this.alert.error("This section is unavailable or under maintaince, please select a different section", this.section);
    });

    this.clutch_admin = this.currentUser[0].roles.some((r: any) => r.profile === 'c_admin');


  }

  eventCreate() {
    this.eventData.p_name = this.section_id;
    this.modalService.getObject(this.eventData);
  }
  kickballSection(): void {
    this.section_id = '578343';
  }
  clutchSection(): void {

    this.section_id = '179925';

    this.clutch.getClutchUserData('practice', this.clutch_name).subscribe(
      (data: any) => {
        this.clutch_attend = data?.data[0];
        console.log(this.clutch_attend); // Handle the data as needed
      },
      (error: any) => {
        this.alert.error('Error fetching Google Sheets data:', error);
      }
    );;

    this.api.getEventsData(this.section_id).subscribe(
      (data: any) => {
        this.clutch_events = data?.data;
        console.log(this.clutch_events); // Handle the data as needed
      },
      (error: any) => {
        this.alert.error('Error fetching Events for Clutch:', error.error);
      }
    );;
  }
  overviewSection(): void {
    this.section_id = '765468';
  }
  grocerySection(): void {
    this.section_id = '657135';
  }
  settingsSection(): void {
    this.section_id = '765468';
  }
  adminSection(): void {
    this.section_id = '231385';
  }
}