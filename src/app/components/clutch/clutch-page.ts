import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';
import { ClutchService } from 'src/app/service/helpers/clutch.service';

@Component({
  selector: 'clucth-page',
  templateUrl: './clutch-page.html',
  styleUrls: ['./clutch-page.css']
})

export class ClutchComponent implements OnInit {
  title = 'Clutch page';
  error = '';
  roster :any;
  users!: User[];
  tournaments!: any[];

  constructor(private clutch: ClutchService) { }

  ngOnInit() {
    this.clutch.getClutchData().subscribe(
      (data:any) => {
        this.roster = data;
        console.log(this.roster); // Handle the data as needed
      },
      (error:any) => {
        console.error('Error fetching Google Sheets data:', error);
      }
    );;
  }
 


}