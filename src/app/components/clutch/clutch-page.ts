import { Component, OnInit,Pipe, PipeTransform } from '@angular/core';
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


@Pipe({
  name: 'TierFilter'
})
export class SearchPipe implements PipeTransform {
  transform(roster:any,filter: string): any[] {
    if (!filter || !roster) {
      return roster;
    }

    // Grouping logic
    const groupedItems: any = {};

    roster.forEach((item:any) => {
      const groupKey = item[filter]; // Assuming filter is a property name in the item object
      if (!groupedItems[groupKey]) {
        groupedItems[groupKey] = [];
      }
      groupedItems[groupKey].push(item);
    });

    // Convert groupedItems object to an array of arrays
    const groupedArray = Object.keys(groupedItems).map(key => ({ key, value: groupedItems[key] }));

    return groupedArray;
  }
}