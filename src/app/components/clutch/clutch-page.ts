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
  attendence: any;
  tournaments:any;
  users!: User[];

  constructor(private clutch: ClutchService) { }

  ngOnInit() {
    this.clutch.getClutchData('contact').subscribe(
      (data:any) => {
        this.roster = data;
        console.log(this.roster); // Handle the data as needed
      },
      (error:any) => {
        console.error('Error fetching Google Sheets data:', error);
      }
    );;
    this.clutch.getClutchData('tourney').subscribe(
      (data:any) => {
        this.tournaments = data;
        console.log(this.tournaments); // Handle the data as needed
      },
      (error:any) => {
        console.error('Error fetching Google Sheets data:', error);
      }
    );;
    this.clutch.getClutchData('practice').subscribe(
      (data:any) => {
        this.attendence = data;
        console.log(this.attendence); // Handle the data as needed
      },
      (error:any) => {
        console.error('Error fetching Google Sheets data:', error);
      }
    );;
  }
 


}