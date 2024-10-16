import { Component, OnInit } from '@angular/core';
import { KickballService } from 'src/app/service/python/kickball.service';
import { User } from '../users/user';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/service.component';

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

  kb_roster: any = [];
  pfp_url: any;

  show_good_stats: boolean = true;
  show_bad_stats: boolean = false;
  player_stats: any ;

  
  scrollToSection() {
    const element = document.getElementById('target-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  constructor(private kbApi: KickballService, private alert: AlertService, private api: ApiService) { }
  
  
  public processPlayerStats(data: any): any {
    return data.map((player:any) => {
      this.pfp_url = '';
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
      console.log(this.kb_roster);
      const pfp = this.kb_roster?.find((r: any) => player['Player Id'] === r.kickball_id)?.pfp;
      console.log(pfp);
      //Get User PFP
      this.api.getTeamProfiles(pfp).subscribe({
        next: (data: Blob) => {
          const reader = new FileReader();
          //console.log(data);
          reader.onload = () => {
            this.pfp_url = reader.result as string;
            //console.log(this.pfp_url);
          };
          reader.readAsDataURL(data);
        }, error: (error: any) => {
          this.alert.error('Error loading profile picture:' + error.message);
        }
      });
      return {
        'Player Id': player['Player Id'],
        'Pfp': this.pfp_url,
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
    this.kbApi.getKBTeamList('697924294').subscribe(
      (data: any) => {
        this.kb_roster = data?.data;
        console.log(data?.data);
      },
      (error: any) => {
        this.alert.error('Could not load team roster: '+ error.message);
      });
    this.kbApi.getKBStatistics().subscribe(
      (data: any) => {
        //console.log(data); // Handle the data as needed
        //console.log(data);
        this.player_stats = this.processPlayerStats(data);
        //console.log(this.player_stats);
      },
      async (error: any) => {
        this.alert.error('Error fetching Kickball Statistics: ' + error.message);
      }
    );
    
    
  }
}
