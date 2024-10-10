import { Component, OnInit } from '@angular/core';
import { KickballService } from 'src/app/service/python/kickball.service';
import { User } from '../users/user';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';

@Component({
  selector: 'kickball-page',
  templateUrl: './kickball-page.html',
  styleUrls: ['./kickball-page.css']
})

export class KickballComponent implements OnInit {

  // good_stats: any = [
  //   { header: "Runs Scored", abbv : "RS" },
  //   { header: "Total Kicks", abbv : "TK" },
  //   { header: "On-Base Kicking", abbv : "OBK" },
  //   { header: "Home Runs", abbv : "HR" },
  //   { header: "Outs Made", abbv : "OM" },
  //   { header: "Total Catches", abbv : "TC" },
  //   { header: "Double Plays", abbv : "DP" },
  //   { header: "Run-Kicks-In", abbv : "RKI" },
  //   { header: "Shotgun Total", abbv : "ST" },
  //   { header: "Shotgun Average Time", abbv : "SAT" }
  // ];
  // bad_stats: any = [
  //   { header: "Strike Outs", abbv : "SO" },
  //   { header: "Errors", abbv : "E" },
  //   { header: "Fouls", abbv : "F" },
  //   { header: "Missed Catches", abbv : "MC" },
  //   { header: "Balls Dropped", abbv : "BP" },
  //   { header: "Bad Throws", abbv : "BT" },
  //   { header: "Missed Tags", abbv : "MT" },
  //   { header: "Shotgun Total", abbv : "ST" },
  //   { header: "Shotgun Average Time", abbv : "SAT" }
  // ];

  good_stats: any = [
    { header: "Runs Scored", abbv : "RS" },
    { header: "Total Kicks", abbv : "TK" },
    { header: "On-Base Kicking", abbv : "OBK" },
    { header: "Home Runs", abbv : "HR" },
    { header: "Outs Made", abbv : "OM" },
    { header: "Total Catches", abbv : "TC" },
    { header: "Double Plays", abbv : "DP" },
    { header: "RKIs", abbv : "RKI" },
    { header: "Shotgun Total", abbv : "ST" }
    
  ];
  bad_stats: any = [
    { header: "Strike Outs", abbv : "SO" },
    { header: "Errors", abbv : "E" },
    { header: "Fouls", abbv : "F" },
    { header: "Shotgun Average Time", abbv : "SAT" }
  ];

  show_good_stats: boolean = true;
  show_bad_stats: boolean = false;
  player_stats: any ;

  
  scrollToSection() {
    const element = document.getElementById('target-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  constructor(private kbApi: KickballService, private alertService:AlertService, private alert: AlertService) { }
  
  
  public processPlayerStats(data: any): any {
    return data.map((player:any) => {
      const goodStats: any[] = [];
      const badStats: any[] = [];

      // Create a lookup for good and bad stats headers
      const goodHeaders = new Set(this.good_stats.map((stat:any) => stat.header));
      const badHeaders = new Set(this.bad_stats.map((stat:any) => stat.header));

      // Process each stat
      player.Stats.forEach((stat:any) => {
        for (const [key, value] of Object.entries(stat)) {
          if (goodHeaders.has(key)) {
            goodStats.push({ [key]: value });
          } else if (badHeaders.has(key)) {
            badStats.push({ [key]: value });
          } 
        }
      });

      return {
        'Player Id': player['Player Id'],
        'Name': player?.Name,
        'Stats': {
          Good: goodStats,
          Bad: badStats,
        },
        'Error': player?.Error,
      };
    });
  };
  
  
  ngOnInit() {
    this.kbApi.getKBStatistics().subscribe(
      (data: any) => {
        //console.log(data); // Handle the data as needed
        //console.log(data);
        this.player_stats = this.processPlayerStats(data);
        //console.log(this.player_stats);
      },
      async (error: any) => {
        this.alert.error('Error fetching Kickball Statistics: ' + error.error);
      }
    );
    
    
  }
}
