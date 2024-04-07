import { Component, OnInit, HostBinding } from '@angular/core';
import { ApiService } from '../../service/service.component';
import { User } from '../users/user';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../../service/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../../service/alert.service';
import { first } from 'rxjs/operators';
import { AppComponent } from 'src/app/app.component';


@Component({
  selector: 'home-page',
  templateUrl: './home-page.html',
  styleUrls: ['./home-page.css']
})

export class HomeComponent implements OnInit {
  title = 'Home page';

  loginForm!: FormGroup;
  loading = false;
  submitted = false;
  home_user = false;

  user_first_name: any;
  currentUser: User[] = [];
  //users: Users[] = [];
  pic_icons: any = [
    {Id: 1, Icon: 'clutch', 
        Body:'This is a test to see how much of the body of text will fill up theis card body'},
    {Id: 2, Icon: 'grocery', 
        Body:''},
    {Id: 3, Icon: 'sacc', 
        Body:''},
    {Id: 4, Icon: 'jam', 
        Body:''},
  ]

  users: User[] = [];

  constructor(
    private api: ApiService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthenticationService,
    private alertService: AlertService,
    private load:AppComponent) { 
     console.log(sessionStorage.getItem('currentUser'));
     this.home_login();
    }


  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });



    
  }





  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;
    this.load.show();
    this.auth.userlogin(this.f['username'].value, this.f['password'].value)
      .pipe(first())
      .subscribe({
        next: () => {
          // get return url from query parameters or default to home page
          this.router.navigate(['/']);
          this.home_login();
          this.load.hide();
        },
        error: error => {
          this.alertService.error(error);
          this.loading = false;
          this.load.hide();
        }
      });
    // .pipe(first())
    // .subscribe(
    //     _data => {
    //         this.router.navigate(['/home_user']);
    //     },
    //     error => {
    //         this.alertService.error(error);
    //         this.loading = false;
    //     });
  }
  loggingOut() {
    this.auth.logout();
  }

home_login(){
  if(sessionStorage.getItem('currentUser')){
    this.home_user = true;
        this.currentUser = JSON.parse(sessionStorage.getItem('currentUser') || '{}');
        console.log(this.currentUser[0].first_name);
       
        this.user_first_name = this.currentUser[0].first_name;
   }else sessionStorage.clear();
}

}