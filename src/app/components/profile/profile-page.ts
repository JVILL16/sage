import { Component, OnInit, HostBinding, OnChanges, Input } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { filter, first } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';



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


  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {console.log("Profile Construct Called"); }



  ngOnInit() {
    this.home_login(); 
    console.log("Profile ONINIT Called");
   
  }
  undoChanges(og_user: User) : void{
    this.edit_screen=!this.edit_screen
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
      console.log(this.currentUser[0]);

      // Get User Account
      this.api.getUser(this.currentUser[0].account_id).subscribe({
        next:(response:User) => {
          
          //Original Account Information
          this.og_account = response;
          //Copy of Account for Editing purposes
          this.account = { ...this.og_account };
          console.log(this.account);
          
          this.tabSections(this.og_account.roles);

          //Get User PFP
          this.api.getUserProfile(this.og_account.account_id, this.og_account.pfp).subscribe({
            next:(data: Blob) => {
            const reader = new FileReader();
            console.log(data);
            reader.onload = () => {
              this.pfp_url = reader.result as string;
              //console.log(this.pfp_url);
            };
            reader.readAsDataURL(data);
          },error:(error) => {
            console.error('Error loading profile picture:', error);
          }});
         
        },error:(error) => {
          console.error('Error getting profile:', error);
        }
      });
      
      
      
      
    } else sessionStorage.clear();

   
  }

  tabSections(roles: any): void{
    this.sections.push( 'overview' );
    roles.forEach((role:any) =>{
      if(role.profile !== 'admin' || role.profile !== 'user'){
        this.sections.push( role.profile );
      }
    });
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
      next: (response) => {
        console.log('User record updated:\n', response);
      },
      error: (error) => {
        console.error('Error updated record:\n', error);
      }
    });
    this.api.uploadImage(this.pfp_new, this.account?.account_id).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:\n', response);
      },
      error: (error) => {
        console.error('Error uploading image:\n', error);
      }
    });

  }


}