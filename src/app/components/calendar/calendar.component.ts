import { Component, Input, OnInit, inject  } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';
import { ClutchService } from 'src/app/service/helpers/clutch.service';
import { ModalsService } from 'src/app/service/modals.service';
import { AlertService } from 'src/app/service/alert.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
})

export class CalendarComponent {

  @Input() attend?: any = [];
  @Input() collection?: any = [];
  @Input() datepicker?: boolean = false;

  
 

  currentUser:any;
  clutch_name:any;
  clutch_user_attend: any;

  currentDate = new Date();
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  numWeeks: any;
  dayObject: any;

  exCollection = [
    {
      Name: 'Practices @ 9AM-12PM',
      Dates: ["5/25/2024", "6/1/2024", "6/8/2024", "6/22/2024", "7/6/2024"],
      Location: 'Houston, TX - Rice Field 6',
      Description: 'Example 1'
    },
    {
      Name: 'Mini Camp',
      Dates: ["6/15/2024", "6/16/2024"],
      Location: 'Houston, TX - Rice Field 6',
      Description: 'Example 2'
    },
    {
      Name: 'Texas Two Finger',
      Dates: ["6/29/2024", "6/30/2024"],
      Location: 'Dallas, TX',
      Description: 'Example 3'
    }
  ];

  constructor(private modalService: ModalsService, private clutch: ClutchService, private alert: AlertService) { }
  getCurrentMonth() {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  getCurrentYear() {
    return this.currentDate.getFullYear();
  }

  goToPreviousMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  }

  goToNextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
  }

  //Datepicker Calendar






  //Events Calendar
  eventsInMonth(day: any) {
    //logic for seeing current day
    if ((day?.Day === new Date().getDate()) && (new Date().getMonth() === this.currentDate.getMonth()) && (new Date().getFullYear() === this.currentDate.getFullYear()))
      day.Current = true;
    for (let i = 0; i < this.collection?.length; i++) {
      for (let j = 0; j < this.collection[i]?.dates.length; j++) {
        //getTime is able to compare the string dates
        if (day?.Date.getTime() === new Date(this.collection[i].dates[j]).getTime())
          day?.Status.push({ Name: this.collection[i].name, Location: this.collection[i].location, Description: this.collection[i].description });

      }
    }
  }
  daysInMonth() {
    const days = [];
    const weeks = [];
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay(); // Day of the week (0-6) for the first day of the month
    const numDaysInMonth = new Date(year, month + 1, 0).getDate(); // Total number of days in the month
    const numDaysInPrevMonth = new Date(year, month, 0).getDate(); // Total number of days in the previous month

    // Add null placeholders for days from the previous month
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      days.push(null);
    }
    // Add days from the current month
    for (let i = 1; i <= numDaysInMonth; i++) {
      //Create day object 
      this.dayObject = {
        Date: new Date(year, month, i),
        Day: i,
        Status: [],
        Current: false
      };
      days.push(this.dayObject);
      //console.log(days[i]?.Date);
      //Adding events into the days array

    }
    // Ensure total days displayed is a multiple of 7 (for a complete week)
    const totalDaysDisplayed = days.length;
    const remainingDays = 7 - (totalDaysDisplayed % 7);
    if (remainingDays !== 0) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null);
      }
    }

    for (let i = 0; i < days.length - 1; i++) {
      this.eventsInMonth(days[i]);
    }
    this.numWeeks = Math.ceil(days.length / 7);

    // Populate the numWeeks array
    for (let i = 0; i < this.numWeeks; i++) {
      // Slice the days array to get the days for the current week
      let week = days.slice(i * 7, (i + 1) * 7);
      weeks.push(week);
    }
    return weeks;
  }
  eventDetail(status: any, day:any) {
    status['Date'] = day.Date;
    //this is where i stopped to check if attendance was submitted or not
    let attendance = this.attend.Attendance.some((item:any)=> item.Date === day.Date.toLocaleDateString() && item.Status!== '');
    this.modalService.getObject({Status:status,User:this.attend.User,Attend:attendance});
  }

  
}