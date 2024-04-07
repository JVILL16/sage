import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';

@Component({
  selector: 'about-page',
  templateUrl: './about-page.html',
  styleUrls: ['./about-page.css']
})

export class AboutComponent implements OnInit {
  title = 'About page';
  error = '';
  users!: User[];

  constructor(private api: ApiService) { }

  ngOnInit() {
    //this.getUsers();
  }
  // subscribe((res: any) => {
  //   this.users = res;
  //   console.log(this.users);
  // },
  //   err => console.log(err)); // this deprecates it



}