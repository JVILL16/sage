import { Component, OnInit,Injectable, HostBinding, OnChanges, Input } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/helpers/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/helpers/alert.service';
import { filter, first } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { AdminComponent } from '../admin/admin-page';
import { LoadingService } from 'src/app/service/helpers/loading.service';



@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('800ms ease-out', style({ transform: 'translateX(0)' })),
      ]),
      // transition(":leave", [
      //   animate('500ms ease-out', style({ transform: 'translateX(-100%)' })),
      // ])
    ]),
    trigger('fadeInTop', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20%)' }),
        animate(800, style({ opacity: 0.7, transform: 'translateY(0%)' }))
       ]),
      // transition(':leave', [
      //   animate('200ms ease-in', style({transform: 'translateY(-20%)'}))
      // ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20%)' }),
        animate('300ms ease-in', style({ opacity: 0.7, transform: 'translateX(0%)' }))
      ]),
      //  transition(':leave', [
      //   animate('200ms ease-out', style({transform: 'translateX(20%)'}))
      // ])
    ])
  ]
}) 
export class ProfileComponent implements OnInit{
  currentUser: User[] = [];
  pfp_image: any;
  pfp_url: any;
  pfp_new: any;
  og_account: any = {};
  @Input() account: any = {};
  edit_screen: boolean = false;
  save_changes : boolean = false;
  sections : any = [];
  section_admin : boolean = false;
  section_c_admin : boolean = false;
  section_kb_admin: boolean = false;


  section_object : any = {};

  activeTab: any;

  

  constructor(private api: ApiService,
    private auth: AuthenticationService,
    private router: Router,
    private alertService: AlertService,
  private load: LoadingService) { }



  ngOnInit() {
    this.home_login(); 
    
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      // this.edit_screen = false;
      // this.save_changes = false;
      this.activeTab = sessionStorage.getItem('nav_section');
    });
    this.activeTab = 'overview';
   
    //console.log(sessionStorage.getItem('nav_section'));
    
  }

 

  undoChanges(og_user: User) : void{
    this.edit_screen=!this.edit_screen;
    if(this.edit_screen){ this.account = { ...og_user};this.save_changes=false; }
    
  }
  checkForChanges(): void {
    // Compare current object with original object
    if (JSON.stringify(this.account) !== JSON.stringify(this.og_account)) {
      console.log('Object has changed!');
      this.save_changes = true;
      // Perform actions if the object has changed
    } else {
      console.log('Object has not changed.');
      this.save_changes = false;
    }
  }
  home_login() {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      //console.log(this.currentUser[0]);

      // Get User Account
      this.api.getUser(this.currentUser[0].account_id).subscribe({
        next:(response:User) => {
          
          //Original Account Information
          this.og_account = response;
          //Copy of Account for Editing purposes
          this.account = { ...this.og_account };
          //console.log(this.account);
          
          this.tabSections(this.og_account.roles);

          //Get User PFP
          this.api.getUserProfile(this.og_account.account_id, this.og_account.pfp).subscribe({
            next:(data: Blob) => {
            const reader = new FileReader();
            //console.log(data);
            reader.onload = () => {
              this.pfp_url = reader.result as string;
              //console.log(this.pfp_url);
            };
            reader.readAsDataURL(data);
          },error:(error:any) => {
            //console.error('Error loading profile picture:', error);
            this.alertService.error('Sorry, was not able to load profile picture.');
          }});
          //this.alertService.success('Profile information loaded');
        },error:(error:any) => {
          //console.error('Error getting profile:', error);
          this.alertService.error('Sorry, was not able to retrieve your profile information.');
        }
      });
      
      
      
      
    } else{
      sessionStorage.clear();
      this.alertService.error('Please login into your account to use this feature.');
    } 

   
  }

  tabSections(roles: any): void{
    this.section_admin = false;
    roles.forEach((role:any) => {

      if(role.profile === 'user')
        this.sections.unshift( 'overview');
      else if(role.profile === 'admin')
        this.section_admin = true;
      else
        this.sections.push( role.profile );
        
    });
    if(this.section_admin) this.sections.push('admin');
    this.sections.push('settings');
  }
  onSelectFile(event: any) {
    console.log(event.target.files[0]);
    this.pfp_url = URL.createObjectURL(event.target.files[0]);
    this.pfp_new = event.target.files[0];
    this.account.pfp = this.pfp_new.name;
    this.save_changes = true;
  }
  saveChanges(): void {
    this.api.updateUser(this.account).subscribe({
      next: (response:any) => {
        //console.log('User record updated:\n', response);
        this.alertService.success('The profile has been updated!\n'+ response);
      },
      error: (error:any) => {
        //console.error('Error updated record:\n', error);
        this.alertService.error('The was an error processing your updated profile.\n'+ error.error);
      }
    });
    this.api.uploadImage(this.pfp_new, this.account?.account_id).subscribe({
      next: (response:any) => {
        console.log('Image uploaded successfully:\n', response);
      },
      error: (error:any) => {
        console.error('Error uploading image:\n', error);
        this.alertService.error(error);
      }
    });

  }

  


}