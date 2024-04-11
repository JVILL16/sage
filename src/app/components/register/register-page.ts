import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../service/service.component';
import { first } from 'rxjs/operators';
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

  url: any = '';

  // angForm: FormGroup;

  registerSuccess: boolean = false;
  registerError: boolean = false;

  email: string = "";
  password: string = "";
  username: string = "";
  first_name: string = "";
  last_name: string = "";
  phone: string = "";


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



  constructor(private fb: FormBuilder, private auth: AuthenticationService, private router: Router, private api: ApiService) { }


  ngOnInit() {
  }
  selectFile(event: any): void {
    this.selectedFiles = event.target.files;
  }

  upload(): void {
    this.progress = 0;

    if (this.selectedFiles) {
      const file: File | null = this.selectedFiles.item(0);

      if (file) {
        this.currentFile = file;

        this.api.upload(this.currentFile).subscribe({
          next: (event: any) => {
            if (event.type === HttpEventType.UploadProgress) {
              this.progress = Math.round(100 * event.loaded / event.total);
            } else if (event instanceof HttpResponse) {
              this.message = event.body.message;
              this.fileInfos = this.api.getFiles();
            }
          },
          error: (err: any) => {
            console.log(err);
            this.progress = 0;

            if (err.error && err.error.message) {
              this.message = err.error.message;
            } else {
              this.message = 'Could not upload the file!';
            }

            this.currentFile = undefined;
          }
        });
      }

      this.selectedFiles = undefined;
    }
  }
  /**
   * 
   * Register function
   * 
   * 
   */
  postdata() {
    for (var role of this.roles)
      if (role.checked) this.role_submit.push(role.id);
    this.auth.userregistration(this.username, this.email, this.password, this.first_name, this.last_name, this.phone, this.role_submit)
      .pipe(first())
      .subscribe({
        next(data) {
          console.log(data);
          //this.router.navigate(['/login']);
        },
        error(error) {
          console.log(error);
        }
      });
  }


  /**
   * 
   * Example file upload got from online
   * 
   */
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

  /**
   * 
   * Functions for switching views 
   * 
   * (There should be a better logic but this should do for now)
   * 
   */
  onNext() {
    if (!this.sectOne && !this.sectTwo && !this.sectThree) {
      this.sectOne = true; this.prevHidden = false;
    }

    else if (this.sectOne && !this.sectTwo && !this.sectThree) {
      this.sectTwo = true; this.nextHidden = true;
    }
    else if (this.sectOne && this.sectTwo && !this.sectThree)
      this.sectThree = true;
    else {
      this.nextHidden = true; this.prevHidden = true;
    }

  }

  onPrevious() {
    if (this.sectOne && this.sectTwo && this.sectThree)
      this.sectThree = false;
    else if (this.sectOne && this.sectTwo && !this.sectThree) {
      this.sectTwo = false; this.nextHidden = false;
    }
    else if (this.sectOne && !this.sectTwo && !this.sectThree) {
      this.sectOne = false; this.prevHidden = true;
    }

    else {
      this.nextHidden = true; this.prevHidden = true;
    }
  }



}