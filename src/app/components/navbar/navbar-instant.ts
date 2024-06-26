import { Component, OnInit } from '@angular/core';
import { User } from '../users/user';
import { AuthenticationService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/service.component';

import { take, map } from 'rxjs/operators';

@Component({
    selector: 'navbar-instant',
    templateUrl: './navbar-instant.html',
    styleUrls: ['./navbar-instant.css']
  })

export class NavbarComponent implements OnInit{
   
    
    
    title = 'Navbar page';

    visibleHomeView: any;
    visibleLoginView: any;
    currentUser: any;
    username: any;
    showAdminTab: any;
    showUsersTab: any;
    count = 0;

    constructor(private auth: AuthenticationService) {
        
        this.auth.isAdmin.subscribe((data)=>{
            this.showAdminTab = data;
            console.log(this.showAdminTab);
        });
        this.auth.isLoggedIn.subscribe((data)=>{
            
            this.showUsersTab = data;
            console.log(this.showUsersTab);
        });
        this.auth.getUsername.subscribe((data)=>{
            
            this.username = data;
            console.log(this.username);
        });
    }
    ngOnInit() {
        // this.visible = this.authService.isLoggedIn;
        //console.log(this.auth.isLoggedIn);
        //this.visibleHomeView = this.authService.isLoggedIn ? '/' : '/';
        //this.visibleLoginView = this.authService.isLoggedIn ? '/admin' : '/login';
        
    
    }
    
}