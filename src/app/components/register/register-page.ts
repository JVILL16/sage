import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/service.component';
import { first, timeout } from 'rxjs/operators';
import { trigger, transition, animate, style, group, query } from '@angular/animations';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/auth.service';
import { Observable } from 'rxjs';
import { HttpEventType, HttpResponse } from '@angular/common/http';



@Component({
  selector: 'register-page',
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
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
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-100%)' }),
        animate(800, style({ opacity: 1, transform: 'translateY(0%)' }))
      ]),
      // transition(':leave', [
      //   animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      // ])
    ]),
    trigger('fadeInLeft', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-100%)' }),
        animate('800ms ease-in', style({ opacity: 1, transform: 'translateX(0%)' }))
      ]),
      //  transition(':leave', [
      //   animate('200ms', style({transform: 'translateX(100%)'}))
      // ])
    ])
  ]
})

export class RegisterComponent {
  title = 'register';

  // angForm: FormGroup;

  registerSuccess: boolean = false;
  registerError: boolean = false;


  email: string = "";
  password: string = "";
  username: string = "";
  first_name: string = "";
  last_name: string = "";
  phone: string = "";


  currentStep: number = 0;
  totalSteps: number = 4;
  dft_list: any = ['male_1', 'female_1', 'male_2', 'female_2', 'male_3', 'female_3', 'user'];
  pfp_image: any;
  pfp_url: any = 'assets/pfp_default/user.png';
  pfp_new: any;
  pfp : any;

  sectOne: boolean = false;
  sectTwo: boolean = false;
  sectThree: boolean = false;
  nextHidden: boolean = false;
  prevHidden: boolean = true;

  selectedFiles?: FileList;
  currentFile?: File;
  progress = 0;
  message = '';
  fileInfos?: Observable<any>;

  roles: any = [{ id: '179925', value: 'Clutch', checked: false }, { id: '539978', value: 'Grocery', checked: false }, { id: '578343', value: 'Kickball', checked: false }];
  role_submit: any = [];



  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router, private api: ApiService, private alertService: AlertService) { }


  ngOnInit() {
  }
 
  /**
   * 
   * Register function
   * 
   * 
   */
  postdata() {
    if (this.currentStep === this.totalSteps - 1) {
      for (var role of this.roles)
        if (role.checked) this.role_submit.push(role.id);
      this.auth.userregistration(this.username, this.email, this.password, this.first_name, this.last_name, this.phone, this.role_submit, this.pfp).subscribe({
        next: (response: any) => {
          console.log(response);
          this.alertService.success('Thank you for registering!\nPlease be on a look out for a activation code in your email inbox.');
          this.uploadPFP(this.pfp,response?.data?.account_id);
          this.registerSuccess=true;
        },
        error: (error: any) => {
          console.error(error);
          this.alertService.error('Error has occured.\nPlease look at error and email owner of the site to further assist you.');
          this.registerError=true;
        }
      });
    }

  }

uploadPFP(image:any,account:any):any{
  this.api.uploadImage(image, account).subscribe({
    next: (response:any) => {
      //console.log('Image uploaded successfully:\n', response);
      this.alertService.success(response?.message);
    },
    error: (error:any) => {
      //console.error('Error uploading image:\n', error);
      this.alertService.error(error?.message);
    }
  });
}
  /**
   * 
   * Example file upload got from online
   * 
   */
  // onSelectFile(event: any) {
  //   console.log(event);
  //   if (event.target.files && event.target.files[0]) {
  //     const reader = new FileReader();

  //     reader.readAsDataURL(event.target.files[0]); // read file as data url

  //     reader.onload = (event) => {
  //       // called once readAsDataURL is completed
  //       this.url = event.target?.result;
  //       console.log(this.url);
  //     };
  //   } else {
  //     const reader = new FileReader();

  //     reader.readAsDataURL(event); // read file as data url

  //     reader.onload = (event) => {
  //       // called once readAsDataURL is completed
  //       this.url = event.target?.result;
  //       console.log(this.url);
  //     }
  //   }
  // }

  onSelectFile(event: any) {
    //console.log(event.target.files[0]);
    if(typeof event === "object"){
      this.pfp_url = URL.createObjectURL(event?.target?.files[0]);
      this.pfp_new = event?.target?.files[0];
      
    }else if(typeof event === "string"){
      this.pfp_url = 'assets/pfp_default/' + event + '.png';
      const file = new File([this.pfp_url],event+'.png',{type:'image/png'});
      this.pfp_new = file;
    }else{
      this.alertService.error('Cannot upload this type of file, please select another.');
    }
    this.pfp = this.pfp_new.name;
    console.log(this.pfp_new);
    
  }

 
  /**
   * 
   * Functions for switching views 
   *
   * 
   */
  onNext() {
    if (this.currentStep < this.totalSteps - 1) {
      this.currentStep++;
    }
  }

  onPrevious() {
    if (this.currentStep > 0) {
      this.currentStep--;
    }
  }



}