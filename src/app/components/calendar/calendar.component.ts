import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';
import { ClutchService } from 'src/app/service/helpers/clutch.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  currentDate = new Date();
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  numWeeks : any;


  constructor() { }
  getCurrentMonth() {
    return this.currentDate.toLocaleString('default', { month: 'long' });
  }

  getCurrentYear() {
    return this.currentDate.getFullYear();
  }

  daysInMonth(){
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
      if(i === this.currentDate.getDate()){
        days.push(
          {
            Date: new Date(year, month, i), 
            Day: i,
            Status: [],
            Current: true
          });
      }else{
        days.push(
          {
            Date: new Date(year, month, i), 
            Day: i,
            Status: [],
            Current: false
          });
      }
        
    }

    // Ensure total days displayed is a multiple of 7 (for a complete week)
    const totalDaysDisplayed = days.length;
    const remainingDays = 7 - (totalDaysDisplayed % 7);
    if (remainingDays !== 0) {
      for (let i = 0; i < remainingDays; i++) {
        days.push(null);
      }
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


}