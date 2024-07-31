import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { User } from '../users/user';
import { ApiService } from '../../service/service.component';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../../service/helpers/auth.service';
import { AlertService } from '../../service/helpers/alert.service';
import { first } from 'rxjs/operators';
import { LoadingService } from 'src/app/service/helpers/loading.service';

@Component({
    selector: 'login-page',
    templateUrl: './login-page.html',
    styleUrls: ['./login-page.css']
  })

export class LoginComponent implements OnInit{
    title = 'Login page';

    loginForm!: FormGroup;
    loading = false;
    submitted = false;
    //returnUrl!: string;

    user: User[] = [];
    
    constructor(
      private api: ApiService,
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private router: Router,
      private auth: AuthenticationService,
      private alertService: AlertService,
      private load: LoadingService) {}


    ngOnInit(){
      this.loginForm = this.formBuilder.group({
        username: ['', Validators.required],
        password: ['', Validators.required]
        });

    

    // get return url from route parameters or default to '/'
      //this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
      
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
      this.load.show('login');
      this.auth.userlogin(this.f['username'].value, this.f['password'].value)
        .pipe(first())
        .subscribe({
          next: () => {
            // get return url from query parameters or default to home page
            this.router.navigate(['/']);
            this.load.hide('login');
          },
          error: error => {
            this.alertService.error(error);
            this.loading = false;
            this.load.hide('login');
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

}