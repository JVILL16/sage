import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService } from './service/helpers/loading.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  
  //when the user navigates away from the Angular application or refreshes the page, 
  //the session storage will be cleared, ensuring that any session-specific data stored 
  //in the browser is removed. 
  @HostListener('window:beforeunload', ['$event'])
    clearSessionStorage(event:any) {
        sessionStorage.clear();
    }

  title = 'jherm-site';
  webpage_loading: boolean = false;
 
  constructor(private router:Router, private load: LoadingService){}
  //make a loading component a provider to add to the constructor ;
  //then make an object that determines if its a webpage load or ;
  //just a regular load
  //call a function to loading component that shows which loading style ;
  //to show

 
  ngOnInit(): void {
    this.load.show('app');
    this.webpage_loading = true;
    setTimeout(()=>{

      this.load.hide('app');
      this.webpage_loading = false;


    },5000);
    
   
  }

}
