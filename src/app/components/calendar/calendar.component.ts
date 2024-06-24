import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';
import { ClutchService } from 'src/app/service/helpers/clutch.service';

@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})

export class CalendarComponent {

  @Input() collection: any = [];


  currentDate = new Date();
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  numWeeks : any;
  dayObject : any;

  newCollection = [
    {
      Name:'Practices @ 9AM-12PM',
      Dates: ["5/25/2024","6/1/2024","6/8/2024","6/22/2024","7/6/2024"],
      Location: 'Houston, TX - Rice Field 6'
    },
    {
      Name:'Mini Camp',
      Dates: ["6/15/2024","6/16/2024","6/29/2024","6/30/2024"],
      Location: 'Houston, TX - Rice Field 6' 
    },
    {
      Name:'Texas Two Finger',
      Dates: ["6/29/2024","6/30/2024"],
      Location: 'Dallas, TX'
    }
  ];

  constructor() { }
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

  eventsInMonth(day:any){
    for(let i = 0; i < this.newCollection.length; i++){
      for(let j = 0; j < this.newCollection[i].Dates.length;j++ ){
        //getTime is able to compare the string dates
        if(day?.Date.getTime() === new Date(this.newCollection[i].Dates[j]).getTime())
          day?.Status.push({Name:this.newCollection[i].Name, Location:this.newCollection[i].Location});
      }
    }
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
      //Create day object 
      this.dayObject = {
        Date: new Date(year, month, i),
        Day: i,
        Status: [],
        Current: false
      };
      days.push(this.dayObject);

      //logic for seeing current day
      if ((i === new Date().getDate()) && (new Date().getMonth() === month))
        days[i].Current = true;
      
      //Adding events into the days array
      this.eventsInMonth(days[i]);
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