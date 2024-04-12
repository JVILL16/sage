import { Component, OnInit, HostBinding } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { first } from 'rxjs/operators';



@Component({
    selector: 'profile-page',
    templateUrl: './profile-page.html',
    styleUrls: ['./profile-page.css']
})

export class ProfileComponent implements OnInit {
    currentUser: User[] = [];
    pfp_image : any;


    constructor(private api: ApiService, private auth: AuthenticationService, private router: Router) {this.home_login();}



    ngOnInit() {
        
    }
    home_login(){
        if(sessionStorage.getItem('currentUser'))
            this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        else sessionStorage.clear();
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
        console.log(event.target.files);
        this.pfp_image = event.target.files[0];
      
      }
      saveChanges() : void{
        this.api.uploadImage(this.pfp_image, this.currentUser[0].account_id).subscribe({
          next: (response) => {
            console.log('Image uploaded successfully:', response.url);
          },
          error: (error) => {
            console.error('Error uploading image:', error);
          }
        });
      }


}