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
  //roster :any;
  attendence: any;
  tournaments:any;
  users!: User[];

  captains:any;
  veterans:any;
  incomers:any;
  practice:any;

  tierOne = (player:any) => player.Tier === '1';
  tierTwo = (player:any) => player.Tier === '2';
  tierThree = (player:any) => player.Tier === '3';
  tierFour = (player:any) => player.Tier === '4';


  constructor(private clutch: ClutchService) { }
 
  ngOnInit() {
    this.clutch.getClutchData('contact').subscribe(
      (data:any) => {
        //this.roster = data;
        this.captains = data.filter(this.tierOne);
        this.veterans = data.filter(this.tierTwo);
        this.incomers = data.filter(this.tierThree);
        this.practice = data.filter(this.tierFour);
        console.log(this.captains); // Handle the data as needed
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