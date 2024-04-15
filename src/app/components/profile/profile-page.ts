import { Component, OnInit, HostBinding } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/auth.service';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { filter, first } from 'rxjs/operators';



@Component({
  selector: 'profile-page',
  templateUrl: './profile-page.html',
  styleUrls: ['./profile-page.css']
})

export class ProfileComponent implements OnInit {
  currentUser: User[] = [];
  pfp_image: any;
  pfp_url: any;
  pfp_current : any;
  pfp_new: any;

  constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {console.log("Profile Construct Called"); }



  ngOnInit() {
    this.home_login(); 
    console.log("Profile ONINIT Called");

   
  }
  home_login() {
    if (sessionStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
      this.pfp_current = this.currentUser[0].pfp;
      console.log(this.currentUser[0]);
      this.api.getUserProfile(this.currentUser[0].account_id, this.currentUser[0].pfp).subscribe({
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
    } else sessionStorage.clear();
  }
  onSelectFile(event: any) {
    // if (event.target.files && event.target.files[0]) {
    //   var reader = new FileReader();

    //   reader.readAsDataURL(event.target.files[0]); // read file as data url

    //   reader.onload = (event) => {
    //     // called once readAsDataURL is completed
    //     console.log(event);
    //     console.log(event.target?.result);
    //     //this.currentUser[0].pfp = event.target?.result;
    //     console.log(this.currentUser[0].pfp);
    //   };
    // }
    console.log(event.target.files[0]);
    this.pfp_url = URL.createObjectURL(event.target.files[0]);
    this.pfp_new = event.target.files[0];
    this.currentUser[0].pfp = this.pfp_new.name;

  }
  saveChanges(): void {
    this.api.updateUser(this.currentUser[0]).subscribe({
      next: (response) => {
        console.log('User record updated:\n', response);
      },
      error: (error) => {
        console.error('Error updated record:\n', error);
      }
    });
    this.api.uploadImage(this.pfp_new, this.currentUser[0].account_id).subscribe({
      next: (response) => {
        console.log('Image uploaded successfully:\n', response);
      },
      error: (error) => {
        console.error('Error uploading image:\n', error);
      }
    });

  }


}