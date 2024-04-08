import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/service.component';
import { first } from 'rxjs/operators';
import { trigger, transition, animate, style } from '@angular/animations';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/auth.service';

@Component({
  selector: 'register-page',
  templateUrl: './register-page.html',
  styleUrls: ['./register-page.css'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0,transform: 'translateY(-100%)' }),
        animate(1000, style({ opacity: 1,transform: 'translateY(0%)' }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      ])
    ])
  ]
})

export class RegisterComponent {
  title = 'register';


  profileImage = '';
  imageToCrop: File;
  // angForm: FormGroup;

  email: string ="";
  password: string ="";
  username: string ="";
  first_name: string ="";
  last_name: string ="";
  phone: string ="";
  roles: any = [{id:'179925',value:'Clutch',checked: false},{id:'539978',value:'Grocery',checked: false},{id:'578343',value:'Kickball',checked: false}];

  role_submit : any = [];
  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router) {

    // this.angForm = this.fb.group({
    //   email: ['', [Validators.required, Validators.minLength(1), Validators.email]],
    //   password: ['', Validators.required],
    //   username: ['', Validators.required],
    //   first_name: ['', Validators.required],
    //   last_name: ['', Validators.required]

    // });
  }

  ngOnInit() {
  }
  postdata() {
    for(var role of this.roles)
        if(role.checked) this.role_submit.push(role.id);
    this.auth.userregistration(this.username,this.email,this.password,this.first_name,this.last_name,this.phone,this.role_submit)
      .pipe(first())
      .subscribe({
          next(data){
            console.log(data);
            //this.router.navigate(['/login']);
          },
          error(error) {
            console.log(error);
          }});
    // this.auth.userregistration(angForm1.value.username, angForm1.value.email, angForm1.value.password, angForm1.value.first_name, angForm1.value.last_name)
    //   .pipe(first())
    //   .subscribe({
    //     next: (data) => {
    //       console.log(data);
    //       this.router.navigate(['/login']);
    //     },
    //     error: error => {
    //       console.log(error);
    //     }
    //   });
  }


  handleFileClick(file: HTMLInputElement): void {
    file.click(); // trigger input file
  }

  fileChangeEvent(event: any): void {
    if (event.target.files.length) {
      this.imageToCrop = event;
    } else {
      this.profileImage = '';
    }
  }

  onCrop(image: File) {
    if (image) {
      console.log('cropped image ready for upload:', image);
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profileImage = e.target.result;
      };
      reader.readAsDataURL(image);
    } else {
      this.profileImage = '';
    }
  }
  // get email() { return this.angForm.get('email'); }
  // get password() { return this.angForm.get('password'); }
  // get username() { return this.angForm.get('username'); }
  // get first_name() { return this.angForm.get('first_name'); }
  // get last_name() { return this.angForm.get('last_name'); }

}