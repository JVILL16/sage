import { Component, OnInit } from '@angular/core';
import { KickballService } from 'src/app/service/python/kickball.service';
import { User } from '../users/user';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/service.component';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from 'src/app/service/helpers/loading.service';

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
  
  player_stats: any = new BehaviorSubject<any[]>([]);

  isLoadingStats: any = false;

  
  scrollToSection() {
    const element = document.getElementById('target-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
  constructor(private kbApi: KickballService, private alert: AlertService, private api: ApiService, private load: LoadingService) { }
  
  
  public async processPlayerStats(data: any, roster: any): Promise<any[]> {
    
    const playerStatsPromises = data.map(async (player: any) => {
      const goodStats: any[] = [];
      const badStats: any[] = [];
  
      // Create a lookup for good and bad stats headers
      const goodHeaders = new Set(this.good_stats.map((stat: any) => stat.header));
      const badHeaders = new Set(this.bad_stats.map((stat: any) => stat.header));
  
      // Process each stat
      player.Stats.forEach((stat: any) => {
        for (const [key, value] of Object.entries(stat)) {
          if (goodHeaders.has(key)) {
            goodStats.push({ [key]: value });
          } else if (badHeaders.has(key)) {
            badStats.push({ [key]: value });
          }
        }
      });
  
      const pfp = roster.find((r: any) => player['Player Id'] === Number(r.kickball_id))?.pfp;
  
      // Get User PFP and wait for it to resolve
      const pfp_url = await this.getProfilePicture(pfp);
  
      return {
        'Player Id': player['Player Id'],
        'Pfp': pfp_url,
        'Name': player?.Name,
        'Stats': {
          Good: goodStats,
          Bad: badStats,
        },
        'Toggle': false,
        'Error': player?.Error,
      };
    });
  
    
    // Wait for all promises to resolve
    return Promise.all(playerStatsPromises);
  }
  public toggleStatsView(player: any): any {
    console.log(this.player_stats);
    player.Toggle = !player.Toggle;
  }

  // New helper function to fetch profile picture
private getProfilePicture(pfp: string): Promise<string> {
  return new Promise((resolve, reject) => {
    this.api.getTeamProfiles(pfp).subscribe({
      next: (data: Blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          resolve(reader.result as string);
        };
        reader.onerror = () => {
          reject(new Error('Error reading profile picture'));
        };
        reader.readAsDataURL(data);
      },
      error: (error: any) => {
        reject(new Error('Error loading profile picture: ' + error.message));
      },
    });
  });
}
  
  public kickballHome(): any{
    this.load.show('kb_main');
    this.isLoadingStats = true;
    this.api.getTeamList('kickball','697924294').subscribe(
      (data: any) => {
        this.kb_roster = data?.data;
        this.kbApi.getKBStatistics().subscribe(
          (statsData: any) => {
            //console.log(data); // Handle the data as needed
            //console.log(data);
            //console.log(this.kb_roster);
            
            this.player_stats = this.processPlayerStats(statsData,this.kb_roster);
            this.isLoadingStats = false;
            //console.log(this.player_stats);
            this.load.hide('kb_main');
          },
          async (error: any) => {
            this.alert.error('Error fetching Kickball Statistics: ' + error.message);
            this.load.hide('kb_main');
            this.load.mini_hide('kb_main_stat');
          }
        );
      },
      (error: any) => {
        this.alert.error('Could not load team roster: '+ error.message);
        this.load.hide('kb_main');
      });
  }
  
  ngOnInit(): void {
    this.kickballHome();
  }
}
