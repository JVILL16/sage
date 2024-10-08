import { Component, OnInit } from '@angular/core';
import { KickballService } from 'src/app/service/python/kickball.service';
import { User } from '../users/user';
import { AlertService } from 'src/app/service/helpers/alert.service';

@Component({
  selector: 'kickball-page',
  templateUrl: './kickball-page.html',
  styleUrls: ['./kickball-page.css']
})

export class KickballComponent implements OnInit {

  constructor(private kbApi: KickballService, private alertService:AlertService) { }
  ngOnInit() {}
}
