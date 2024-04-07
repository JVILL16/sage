import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/service/service.component';
import { User } from '../users/user';

@Component({
  selector: 'clucth-page',
  templateUrl: './clutch-page.html',
  styleUrls: ['./clutch-page.css']
})

export class ClutchComponent implements OnInit {
  title = 'Clutch page';
  error = '';
  users!: User[];

  constructor(private api: ApiService) { }

  ngOnInit() {
    
  }
 


}