import { Component, OnInit } from '@angular/core';
import { User } from '../users/user';
import { AuthenticationService } from '../../service/auth.service';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/service/service.component';
import { ActivatedRoute, Router, ParamMap } from '@angular/router';


@Component({
    selector: 'sections-page',
    templateUrl: './sections-page.html',
    styleUrls: ['./sections-page.css']
  })

export class SectionsComponent implements OnInit{
   
  
    section: any;

    constructor(private auth: AuthenticationService,private activatedRoute: ActivatedRoute, private router: Router) {
       
    }
    ngOnInit() {
     
      this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
        this.section = params.get('section'); 
      })
    }
    
}