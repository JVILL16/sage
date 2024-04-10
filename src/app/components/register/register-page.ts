import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/service.component';
import { first } from 'rxjs/operators';
import { trigger, transition, animate, style, group, query } from '@angular/animations';
import { AlertService } from '../../service/alert.service';
import { Router } from '@angular/router';
import { AuthenticationService } from 'src/app/service/auth.service';



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
        style({ opacity: 0,transform: 'translateY(-100%)' }),
        animate(800, style({ opacity: 1,transform: 'translateY(0%)' }))
       ]),
      // transition(':leave', [
      //   animate('200ms ease-in', style({transform: 'translateY(-100%)'}))
      // ])
    ])
  ]
})

export class RegisterComponent {
  title = 'register';

  url: any = '';
  
  // angForm: FormGroup;

  email: string ="";
  password: string ="";
  username: string ="";
  first_name: string ="";
  last_name: string ="";
  phone: string ="";


  sectOne: boolean = false;
  sectTwo: boolean = false;
  sectThree : boolean = false;
  nextHidden: boolean = false;
  prevHidden: boolean = true;

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
  
  onSelectFile(event: any) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.url = event.target?.result;
        console.log(this.url);
      };
    }
  }
  public delete() {
    this.url = null;
  }

  onNext() {
    if(!this.sectOne && !this.sectTwo && !this.sectThree){
      this.sectOne = true;this.prevHidden = false;
    }
      
    else if(this.sectOne && !this.sectTwo && !this.sectThree){
      this.sectTwo = true;this.nextHidden = true;
    }
    else if(this.sectOne && this.sectTwo && !this.sectThree)
      this.sectThree = true;
    else
      console.log("yay");
  }

  onPrevious() {
    if(this.sectOne && this.sectTwo && this.sectThree)
      this.sectThree = false;
    else if(this.sectOne && this.sectTwo && !this.sectThree){
      this.sectTwo = false;this.nextHidden = false;
    }
    else if(this.sectOne && !this.sectTwo && !this.sectThree){
      this.sectOne = false;this.prevHidden = true;
    }
      
    else
      console.log("yay");
  }

  
  // get email() { return this.angForm.get('email'); }
  // get password() { return this.angForm.get('password'); }
  // get username() { return this.angForm.get('username'); }
  // get first_name() { return this.angForm.get('first_name'); }
  // get last_name() { return this.angForm.get('last_name'); }

}