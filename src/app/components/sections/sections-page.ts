import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from '../users/user';
import { AuthenticationService } from '../../service/helpers/auth.service';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/service.component';
import { ActivatedRoute, Router, ParamMap, NavigationStart } from '@angular/router';
import { ClutchService } from 'src/app/service/helpers/clutch.service';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { ModalsService } from 'src/app/service/helpers/modals.service';
import { KickballService } from 'src/app/service/python/kickball.service';
import { trigger, transition, animate, style, state, group, query } from '@angular/animations';
import { collapseAnimation, rubberBandAnimation } from 'angular-animations';
import { LoadingService } from 'src/app/service/helpers/loading.service';


@Component({
  selector: 'sections-page',
  templateUrl: './sections-page.html',
  styleUrls: ['./sections-page.css']
})

export class SectionsComponent implements OnInit {

  currentUser: any;

  section: any;
  sectionRoute: any;

  profile_id: any;




  constructor(private auth: AuthenticationService,
    private activatedRoute: ActivatedRoute,
    private api: ApiService,
    private router: Router,
    private alert: AlertService,
    private clutch: ClutchService,
    private modalService: ModalsService) {
    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');

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
      // if (this.section == 'overview')
      //   this.overviewSection();
      // else if (this.section == 'clutch')
      //   this.clutchSection();
      // else if (this.section == 'grocery')
      //   this.grocerySection();
      // else if (this.section == 'kickball')
      //   this.kickballSection();
      // else if (this.section == 'admin')
      //   this.adminSection();
      // else if (this.section == 'settings')
      //   this.settingsSection();
      // else
      //   this.alert.error("This section is unavailable or under maintaince, please select a different section", this.section);
    });

  }


  kickballSection(): void {
    this.profile_id = '578343';
  }
  clutchSection(): void {
    this.profile_id = '179925';
  }
  overviewSection(): void {
    this.profile_id = '765468';
  }
  grocerySection(): void {
    this.profile_id = '657135';
  }
  settingsSection(): void {
    this.profile_id = '765468';
  }
  adminSection(): void {
    this.profile_id = '231385';
  }
}

@Component({
  selector: 'clutch-profile',
  templateUrl: './clutch/clutch-profile.html',
  styleUrls: ['./clutch/clutch-profile.css']
})

export class ClutchProfileComponent implements OnInit {

  currentUser: any;
  profile_id: any;

  clutch_attend: any;
  clutch_events: any;
  clutch_name: any;
  clutch_statistics_links: any;
  clutch_stat_link_player: any = '';
  clutch_admin: boolean = false;

  eventData: any = {
    name: '',
    dates: '',
    location: '',
    description: '',
    p_name: ''
  }
  linkData: any = {
    name: '',
    category: '',
    link: '',
    p_name: ''
  }

  statisticLinks = (link: any) => link.category === 'Statistics';

  constructor(private clutchApi: ClutchService,
    private api: ApiService,
    private alert: AlertService,
    private modalService: ModalsService,
    private load: LoadingService) {

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.profile_id = this.currentUser[0].roles.find((p: any) => p.profile === 'clutch')?.profile_id;
    this.clutch_name = this.currentUser[0].first_name + " " + this.currentUser[0].last_name;
    this.modalService.getResetModalObj.subscribe((data: any) => {
      if (data) {
        this.eventData = {
          name: '',
          dates: '',
          location: '',
          description: '',
          p_name: this.profile_id
        };
        this.linkData = {
          link_id: '',
          name: '',
          category: '',
          link: '',
          p_name: this.profile_id
        }
      }
      //this.modalService.getReset(false);
    });
    this.modalService.getRefreshPage.subscribe((data: any) => {
      if (data === 'clutch_section')
        this.clutch_home();
    });

  }

  eventCreate() {
    this.eventData.p_name = this.profile_id;
    this.modalService.getObject(this.eventData);
  }
  linkCreate() {
    this.linkData.p_name = this.profile_id;
    this.modalService.getObject(this.linkData);
  }
  linkDelete(linkData: any) {
    linkData.p_name = this.profile_id;
    this.modalService.getObject(linkData);
  }

  public clutch_home() {
    this.clutch_admin = this.currentUser[0].roles.some((r: any) => r.profile === 'c_admin');
    this.clutchApi.getClutchUserData('practice', this.clutch_name).subscribe(
      (data: any) => {
        this.clutch_attend = data?.data[0];
        console.log(this.clutch_attend); // Handle the data as needed
      },
      (error: any) => {
        this.alert.error('Error fetching Google Sheets data:', error);
      }
    );;

    this.api.getEventsData(this.profile_id).subscribe(
      (data: any) => {
        this.clutch_events = data?.data;
        //console.log(this.clutch_events); // Handle the data as needed
      },
      (error: any) => {
        this.alert.error('Error fetching Events for Clutch:', error.error);
      }
    );;
    this.api.getLinksData(this.profile_id).subscribe(
      (data: any) => {
        this.clutch_statistics_links = data?.data.filter(this.statisticLinks);
        let filter_UA_stat = this.clutch_statistics_links
          .filter((link: any) => /https?:\/\/(www\.)?ultianalytics\./.test(link?.link))
          .map((link: any) => {
            return [
              {
                "name": link?.name + " Players",
                "link": link?.link.replace(/\/[^\/]+$/, '') + "/players",
                "input": false
              },
              {
                "name": link?.name + " Individual Player",
                "link": link?.link.replace(/\/[^\/]+$/, '') + "/player/",
                "input": true
              }
            ]
          });
        filter_UA_stat.forEach((link: any, index: any) => {
          var stat_index = index * 2 + 1
          this.clutch_statistics_links.splice(stat_index, 0, link[0], link[1]);
        });
      },
      (error: any) => {
        this.alert.error('Error fetching Links for Clutch: ' + error.error);
      }
    );;
  }
  ngOnInit() {
    this.clutch_home();
  }
}

@Component({
  selector: 'kickball-profile',
  templateUrl: './kickball/kickball-profile.html',
  styleUrls: ['./kickball/kickball-profile.css'],
  animations: [
    rubberBandAnimation({ anchor: 'rubber', direction: '=>', duration: 500 })
  ]
})

export class KickballProfileComponent implements OnInit {

  currentUser: any;
  profile_id: any;
  section_id: any;
  team_id: any;

  kickball_username: any = '';
  kickball_password: any = '';
  valid_login: boolean = true;
  kickball_userInfo: any;
  kickball_objectInfo: any;

  kb_login_cookie: boolean = false;
  kb_login: any;
  kb_placeholder: boolean = false;
  kickball_admin:any;

  kb_breadcrumbs: any = [];

  rubberState: any = false;

  eventData: any = {
    name: '',
    dates: '',
    location: '',
    description: '',
    p_name: ''
  }
  linkData: any = {
    name: '',
    category: '',
    link: '',
    p_name: ''
  }

  rosterData: any = {
    all: [],
    rostered: []
  }

  announceData: any = {
    announcement: '',
    color: '',
    created_by: '',
    p_name: '',
    t_name: ''
  }
  counter(i: number) {
    return new Array(i);
  }
  constructor(private kbApi: KickballService,
    private alert: AlertService,
    private load: LoadingService,
    private modal: ModalsService,
    private api: ApiService) {

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.profile_id = this.currentUser[0].roles.find((p: any) => p.profile === 'kickball')?.profile_id;
    this.section_id = this.currentUser[0].roles.find((p: any) => p.profile === 'kickball')?.section_id;
    this.team_id = '697924294';
    if(this.kickball_admin) this.rosterCheck();
    this.modal.getResetModalObj.subscribe((data: any) => {
      if (data) {
        this.eventData = {
          name: '',
          dates: '',
          location: '',
          description: '',
          p_name: this.profile_id
        };
        this.linkData = {
          link_id: '',
          name: '',
          category: '',
          link: '',
          p_name: this.profile_id
        }
        this.announceData = {
          announcement: '',
          color: 'linear-gradient(#8ec0f2, #58a4f0, #1584f2)',
          created_by: this.currentUser[0].account_id,
          p_name: this.profile_id,
          t_name: this.team_id
        }
        if(this.kickball_admin) this.rosterCheck();
      }
      //this.modalService.getReset(false);
    });
    this.modal.getRefreshPage.subscribe((data: any) => {
      if (data === 'kickball_section')
        this.kickball_home();
    });

  }
  eventCreate() {
    this.eventData.p_name = this.profile_id;
    this.modal.getObject(this.eventData);
  }
  linkCreate() {
    this.linkData.p_name = this.profile_id;
    this.modal.getObject(this.linkData);
  }
  linkDelete(linkData: any) {
    linkData.p_name = this.profile_id;
    this.modal.getObject(linkData);
  }
  rosterEdit(){
    this.modal.getObject(this.rosterData);
  }
  announceCreate(){
    this.announceData.color = 'linear-gradient(#8ec0f2, #58a4f0, #1584f2)';
    this.announceData.created_by =this.currentUser[0].account_id;
    this.announceData.p_name = this.profile_id;
    this.announceData.t_name = this.team_id;
    this.modal.getObject(this.announceData);
  }
  announceList(){
    this.modal.getObject({profile: this.profile_id,team : this.team_id, announceList: true, user: this.currentUser[0].account_id});
  }

  rosterCheck() {
    this.api.getTeamList('kickball', '697924294').subscribe(
      (data: any) => {
        console.log(data?.data);
        this.rosterData.rostered = data?.data;
        this.api.getAllTeamList('kickball').subscribe(
          (data: any) => {
            console.log(data?.data);
            this.rosterData.all = data?.data.filter((player: any) => !this.rosterData.rostered.some((rostered: any) => rostered.team_id === player.team_id));
            console.log(this.rosterData.rostered);
            this.rosterData.rostered.forEach((player: any) => {
              this.api.getTeamProfiles(player.pfp).subscribe({
                next: (data: Blob) => {
                  const reader = new FileReader();
                  //console.log(data);
                  reader.onload = () => {
                    player.pfp_url = reader.result as string;
                    //console.log(player.pfp);
                  };
                  reader.readAsDataURL(data);
                }, error: (error: any) => {
                  //console.error('Error loading profile picture:', error);
                  this.alert.error('Sorry, was not able to load profile picture. ' + error.messsage);
                }
              });
            });
            this.rosterData.all.forEach((player: any) => {
              this.api.getTeamProfiles(player.pfp).subscribe({
                next: (data: Blob) => {
                  const reader = new FileReader();
                  //console.log(data);
                  reader.onload = () => {
                    player.pfp_url = reader.result as string;
                    //console.log(player.pfp);
                  };
                  reader.readAsDataURL(data);
                }, error: (error: any) => {
                  //console.error('Error loading profile picture:', error);
                  this.alert.error('Sorry, was not able to load profile picture. ' + error.messsage);
                }
              });
            });
            console.log(this.rosterData.rostered);
          },
          async (error: any) => {
            this.alert.error('Error fetching Kickball players: ' + error.message);
          }
        );
      },
      async (error: any) => {
        this.alert.error('Error fetching Rostered players: ' + error.message);
      }
    );

  }
  public login() {
    this.load.show('kb_profile');
    this.kb_placeholder = true;
    this.kbApi.loginSACC(this.kickball_username, this.kickball_password).subscribe(
      (data: any) => {
        console.log(data);
        this.valid_login = true;
        this.kb_placeholder = false;
        this.kickball_userInfo = data.data.Profile;
        this.kickball_objectInfo = data.data.ObjectLink;
        this.kb_breadcrumbs.push(data.data.ObjectLink)
        this.load.hide('kb_profile');
      },
      (error: any) => {
        this.alert.error('Error fetching Login from SACC: ' + error.error);
        this.valid_login = false;
        this.kb_placeholder = false;
        this.load.hide('kb_profile');
      }
    );;
  }
  public kickball_home() {
    
    this.kbApi.getKBUser(this.section_id).subscribe(
      (data: any) => {
        //console.log(data); // Handle the data as needed
        this.kb_login = data.data[0];
        this.kickball_admin = this.kb_login?.admin;
        if(this.kickball_admin) this.rosterCheck();
        this.kb_login_cookie = this.kb_login?.username && this.kb_login?.password ? true : false;
        //console.log(this.kb_login_cookie);
        if (this.kb_login_cookie) {
          this.kickball_username = this.kb_login?.username;
          this.kickball_password = this.kb_login?.password;
          this.login();
        } else {
          this.valid_login = false;
          this.kickball_username = this.kb_login?.username;
          this.kickball_password = this.kb_login?.password;
        }
        
      },
      async (error: any) => {
        this.alert.error('Error fetching Kickball user info: ' + error.error);
      }
    );
  }

  public kickball_link_team(page:string,link: string,index:any) {
    this.kb_placeholder = true;
    if (page === 'schedule')
      this.kbApi.getKBScheduleInfo(link).subscribe(
        (data: any) => {
          console.log(data);
          this.kickball_objectInfo = data.data.ObjectLink;
          if(index!=null) this.kb_breadcrumbs.splice(index+1); else this.kb_breadcrumbs.push(data.data.ObjectLink);
          this.kb_placeholder = false;
        },
        async (error: any) => {
          this.alert.error('Error fetching Kickball Schedule Info: ' + error.error);
          this.kb_placeholder = false;
        });
    else if (page === 'team')
      this.kbApi.getKBTeamInfo(link).subscribe(
        (data: any) => {
          console.log(data);
          this.kickball_objectInfo = data.data.ObjectLink;
          if(index!=null) this.kb_breadcrumbs.splice(index+1); else this.kb_breadcrumbs.push(data.data.ObjectLink);
          this.kb_placeholder = false;
        },
        async (error: any) => {
          this.alert.error('Error fetching Kickball Team Info: ' + error.error);
          this.kb_placeholder = false;
        });
    else if (page === 'profile')
      this.kbApi.loginSACC(this.kickball_username, this.kickball_password).subscribe(
        (data: any) => {
          console.log(data);
          this.valid_login = true;
          this.kickball_userInfo = data.data.Profile;
          this.kickball_objectInfo = data.data.ObjectLink;
          console.log(index);
          if (index!=null) this.kb_breadcrumbs.splice(index + 1); else this.kb_breadcrumbs.push(data.data.ObjectLink);
          this.load.hide('kb_profile');
          this.kb_placeholder = false;
        },
        (error: any) => {
          this.alert.error('Error fetching Login from SACC: ' + error.error);
          this.valid_login = false;
          this.load.hide('kb_profile');
          this.kb_placeholder = false;
        }
      ); 
      else if (page === 'invoice')
        console.log('Invoice Page: ' + link );
    else {
      this.alert.error('Error fetching Kickball Link');
      this.kb_placeholder = false;
    }
      

  }
  ngOnInit() {
    this.kickball_home();

  }
}

@Component({
  selector: 'settings-profile',
  templateUrl: './settings/settings-profile.html',
  styleUrls: ['./settings/settings-profile.css']
})

export class SettingsProfileComponent implements OnInit {

  currentUser: any;
  kb_section_id: any;
  kb_setting_username: any = '';
  kb_setting_password: any = '';
  kb_user_acc: any = {};
  copy_kb_user_acc: any = {};
  kb_setting_edit: boolean = false;
  save_changes: boolean = false;

  rubberState: any = false;

  constructor(private kbApi: KickballService,
    private alert: AlertService,
    private load: LoadingService) {

    this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
    this.kb_section_id = this.currentUser[0].roles.find((p: any) => p.profile === 'kickball')?.section_id;
  }

  undoChanges(): void {
    //console.log(this.kb_user_acc);
    this.kb_setting_edit = !this.kb_setting_edit;
    if (this.kb_setting_edit) { this.copy_kb_user_acc = { ...this.kb_user_acc }; this.save_changes = false; }
    //console.log(this.kb_user_acc);

  }
  checkForChanges(): void {
    // Compare current object with original object
    if (JSON.stringify(this.kb_user_acc) !== JSON.stringify(this.copy_kb_user_acc)) {
      console.log('Object has changed!');
      this.save_changes = true;
      // Perform actions if the object has changed
    } else {
      console.log('Object has not changed.');
      this.save_changes = false;
    }
  }
  public settings_kb_home() {
    this.kbApi.getKBUser(this.kb_section_id).subscribe(
      (data: any) => {
        this.kb_user_acc = data.data[0];
        this.copy_kb_user_acc = { ...this.kb_user_acc };
        console.log(this.copy_kb_user_acc);
      },
      async (error: any) => {
        this.alert.error('Error fetching Kickball user info: ' + error.error);
      }
    );

  }
  public saveKBUser(): void {
    this.kbApi.updateKBUser(this.copy_kb_user_acc, this.kb_section_id).subscribe(
      (data: any) => {
        this.alert.success('Your info in Kickball section has been updated: ' + data.message);
        this.kb_setting_edit = false;
        this.settings_kb_home();
      },
      async (error: any) => {
        this.alert.error('Error fetching Kickball user info: ' + error.error);
      }
    );
  }
  ngOnInit() {
    this.settings_kb_home();
  }
}

