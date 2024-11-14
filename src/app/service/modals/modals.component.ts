import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from '../service.component';
import { User } from '../../components/users/user';
import { Observable, Subscription } from 'rxjs';
import { AuthenticationService } from '../helpers/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertService } from '../helpers/alert.service';
import { first, map } from 'rxjs/operators';
import { AdminComponent } from 'src/app/components/admin/admin-page';
import { ModalsService } from '../helpers/modals.service';
import { ClutchService } from '../helpers/clutch.service';


import { JsonPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgbCalendar, NgbDatepickerModule, NgbDateStruct, NgbDate } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-modal',
    templateUrl: './modals.component.html',
    styleUrls: ['./modals.component.css'],
    standalone: true,
    imports: [NgbDatepickerModule, FormsModule, JsonPipe, CommonModule]
})

export class ModalsComponent {

    // @Input() component_object: any;
    private subscription!: Subscription;
    component_object: any;
    copy_component_object:any;
    component_categories: any;

    listAdd: any = [];

   

    attending: boolean = false;
    attend: any;

    model: NgbDateStruct | undefined;
    modelList: Array<NgbDateStruct> = [];

    kb_save_changes : boolean = false;
    kb_updatedPlayers: any[] = [];
    kb_addedPlayers: any[] = [];
    kb_removedPlayers: any[] = [];
    kb_selectedPlayerId: number | null = null;
    kb_selectedRosteredPlayerId: number | null = null;
    kb_show_new_player: boolean = false;
    kb_new_player: any = {
        kickball_id: '',
        name: '',
        pfp: '',
        team_id: '',
        deleteToggle: true
    }


    event_Submit: boolean = false;
    link_Submit: boolean = false;

    categories: any = [
        {
            profile: '179925',
            list: ['Schedule', 'Annoucements', 'Tournaments', 'Statistics']
        }
    ]

    // @Input() account_id : any;
    // @Input() profiles : any;
    // @Input() profile_id : any;



    constructor(private modalService: ModalsService, 
                private api: ApiService, 
                private auth: AuthenticationService, 
                private clutch: ClutchService,
                private alert: AlertService) {
        this.modalService.getModalView.subscribe((data: any) => {
            this.component_object = data;
            this.copy_component_object = JSON.parse(JSON.stringify(data));
            console.log(this.component_object);
            this.component_categories = this.categories.filter((c: any) => c.profile === this.component_object?.p_name)[0]?.list;
            //console.log(this.categories.filter((c: any) => c.profile === this.component_object?.p_name));
        });
    }

    closeModal() { this.modalService.getReset(true); this.modelList = [] };
    //right here i have to make a call from modal service to sections page wheere the object is stored since that is the only way to reset it
    //closeAddEventModal = () => this.component_object = { name:'', dates: '', location:'', description:'', p_name:'' } && (this.modelList = []);
    dp_isSelected(date: any) {
        // console.log(this.modelList.indexOf(date));
        // console.log(this.modelList);
        //return this.modelList.indexOf(date) >= 0;
        return this.modelList.some((d: any) => d.equals(date));
    };
    dp_selectOne(date: any) {
        //console.log(date);
        // console.log(this.modelList.indexOf(date));
        if (this.dp_isSelected(date)) {
            this.modelList = this.modelList.filter((ele: any) => !ele.equals(date));
        } else {
            this.modelList.push(date);
        }
        console.log(this.modelList);
    }

    clutch_AddEvent() {
        this.event_Submit = true;
        this.modelList.map((d: any) => {
            //.padStart(2, '0')
            const day = String(d.day);
            const month = String(d.month);
            const year = String(d.year);
            const date = `${month}/${day}/${year};`;
            if (date !== undefined && date !== null) {
                this.component_object.dates += date;
            }

        });
        this.component_object.dates.replace(/;$/, '');
        //console.log(this.component_object);
        this.api.createEventData(this.component_object).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
        this.api.insertGSheetEventData(this.component_object).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
        this.modalService.getRefresh('clutch_section');
        this.closeModal();
        setTimeout(() => {

            this.event_Submit = false;

        }, 5000);


    }

    announceAdd(){
        console.log(this.component_object);
        this.api.createAnnounce(this.component_object).subscribe({
            next: (response: any) => {
                console.log(response);
                this.alert.success("Announcement Sent!");
            },
            error: (error: any) => {
                console.log(error);
                this.alert.error("Error processing Announcement");
            }
        });
    }


    /********************************************************************************************************
     * 
     *                                              Kickball Profile Modals
     * 
     * 
     ********************************************************************************************************/
    kb_selectPlayer(playerId: number) : any {
        this.kb_selectedPlayerId = playerId === this.kb_selectedPlayerId ? null : playerId; // Toggle selection
    }
    kb_selectRosteredPlayer(playerId: number) : any {
        this.kb_selectedRosteredPlayerId = playerId === this.kb_selectedRosteredPlayerId ? null : playerId;
    }

    kb_movePlayerToRoster(): any {
        if (this.kb_selectedPlayerId !== null) {
            const playerIndex = this.component_object.all.findIndex((player: any) => player.kickball_id === this.kb_selectedPlayerId);

            if (playerIndex > -1) {
                this.component_object.all[playerIndex].team_id = '697924294';
                const player = this.component_object.all[playerIndex];
                this.component_object.all.splice(playerIndex, 1); // Remove from 'all' list
                this.component_object.rostered.push(player);       // Add to 'rostered' list
                this.kb_selectedPlayerId = null; // Reset selection
            }
        }
        this.kb_checkChanges();
        
    }

    kb_moveToAll(): any {
        if (this.kb_selectedRosteredPlayerId !== null) {
            const playerIndex = this.component_object.rostered.findIndex((player: any) => player.kickball_id === this.kb_selectedRosteredPlayerId);
            if (playerIndex !== -1) {
                this.component_object.rostered[playerIndex].team_id = '';
                // Move player back to all players list
                const player = this.component_object.rostered.splice(playerIndex, 1)[0];
                this.component_object.all.push(player);

                // Reset selectedRosteredPlayerId
                this.kb_selectedRosteredPlayerId = null;
            }
        }
        this.kb_checkChanges();
    }

    kb_createPlayer(newplayer: any): any {

        setTimeout(()=>{
            newplayer.kickball_id = (Math.random() * 10).toString(36).replace('.', '');
            this.component_object.all.push(newplayer);
          },500);
       
        this.kb_new_player = {
            kickball_id: '',
            name: '',
            pfp: '',
            team_id: '',
            deleteToggle: true
        }
        //console.log(this.component_object.all);
    }

    kb_onSelectPFP(event: any,player:any) {
        //console.log(event);
        player.pfp_url = URL.createObjectURL(event.target.files[0]);
        player.file = event.target.files[0];
        player.pfp = event.target.files[0].name;
        // this.save_changes = true;
        //console.log(this.component_object.rostered);
        this.kb_checkChanges();
    }

    /*
    kb_compareArrays(): any {
        // Use a Set to track unique IDs
        //console.log(this.copy_component_object.rostered);
        //console.log(this.component_object.rostered);
        const getIds = (arr: any[]) => new Set(arr.map(obj => obj.kickball_id));
    
        const oldIds = getIds(this.copy_component_object.rostered);
        const newIds = getIds(this.component_object.rostered);
    
        // Find added and removed IDs
        const addedIds = [...newIds].filter(kickball_id => !oldIds.has(kickball_id));
        const removedIds = [...oldIds].filter(kickball_id => !newIds.has(kickball_id));
    
        const changes:any = [];
        // // Map IDs back to objects
        // this.kb_addedPlayers = this.component_object.rostered.filter((player:any) => addedIds.includes(player.kickball_id));
        // this.kb_removedPlayers = this.copy_component_object.rostered.filter((player:any) => removedIds.includes(player.kickball_id));
        //  // Detect if any properties have changed
        // this.kb_modifiedPlayers = this.component_object.rostered.filter((newPlayer: any) => {
        //     const oldPlayer = this.copy_component_object.rostered.find((player: any) => player.kickball_id === newPlayer.kickball_id);
        //     // If oldPlayer exists, check if any properties have changed
        //     if (oldPlayer) {
        //         return oldPlayer.name !== newPlayer.name || oldPlayer.pfp !== newPlayer.pfp;
        //     }

        //     return false;
        // });
        this.component_object.rostered.forEach((player: any) => {
            if (addedIds.includes(player.kickball_id)) {
                changes.push(player);
            }
        });
        this.component_object.all.forEach((rmvPlayer: any) => {
            const oldPlayer = this.copy_component_object.rostered.find((player: any) => player.kickball_id === rmvPlayer.kickball_id);
            //const allPlayers = this.component_object.all.find((player:any) => player.kickball_id === rmvPlayer.kickball_id);
            if (removedIds.includes(rmvPlayer.kickball_id)) {
                if(rmvPlayer.pfp !== oldPlayer.pfp)
                    rmvPlayer.pfp = oldPlayer.pfp;
                changes.push(rmvPlayer);
            }
        });
        this.component_object.rostered.forEach((newPlayer: any) => {
            const oldPlayer = this.copy_component_object.rostered.find((player: any) => player.kickball_id === newPlayer.kickball_id);
            if (oldPlayer && (oldPlayer.pfp !== newPlayer.pfp)) {
                changes.push(newPlayer);
            }
        });
        this.kb_updatedPlayers = changes;
        console.log(this.kb_updatedPlayers);
    }
    */
   
    kb_saveRostered() : any{
        
        const getIds = (arr: any[]) => new Set(arr.map(obj => obj.kickball_id));
    
        const oldIds = getIds(this.copy_component_object.rostered);
        const newIds = getIds(this.component_object.rostered);
    
        // Find added and removed IDs
        const addedIds = [...newIds].filter(kickball_id => !oldIds.has(kickball_id));
        const removedIds = [...oldIds].filter(kickball_id => !newIds.has(kickball_id));
    
        const changes:any = [];

        this.component_object.rostered.forEach((player: any) => {
            if (addedIds.includes(player.kickball_id)) {
                changes.push(player);
            }
        });
        this.component_object.all.forEach((rmvPlayer: any) => {
            const oldPlayer = this.copy_component_object.rostered.find((player: any) => player.kickball_id === rmvPlayer.kickball_id);
            //const allPlayers = this.component_object.all.find((player:any) => player.kickball_id === rmvPlayer.kickball_id);
            if (removedIds.includes(rmvPlayer.kickball_id)) {
                if(rmvPlayer.pfp !== oldPlayer.pfp)
                    rmvPlayer.pfp = oldPlayer.pfp;
                changes.push(rmvPlayer);
            }
        });
        this.component_object.rostered.forEach((newPlayer: any) => {
            const oldPlayer = this.copy_component_object.rostered.find((player: any) => player.kickball_id === newPlayer.kickball_id);
            if (oldPlayer && (oldPlayer.pfp !== newPlayer.pfp)) {
                newPlayer.og_pfp = oldPlayer.pfp;
                changes.push(newPlayer);
            }
        });
        this.kb_updatedPlayers = changes;
        //this.kb_compareArrays();
        this.kb_updatedPlayers.forEach((player:any)=>{
            const playerUpdate = { kickball_id: player.kickball_id, name: player.name, pfp: player.pfp, team_id: player.team_id};
            this.api.updateTeamRoster(playerUpdate).subscribe({
                next: (response: any) => {
                    //console.log(response);
                    this.alert.success("Thank you for updating " + player.name + "'s information.");
                },
                error: (error: any) => {
                    //console.log(error);
                    this.alert.error("Error processing  " + player.name + "'s information.");
                }
            });
            if(player.file){
                this.api.uploadPlayerImage(player.file,player.og_pfp).subscribe({
                    next: (response: any) => {
                        this.alert.success(player.name + "'s photo uploaded.");
                    },
                    error: (error: any) => {
                        //console.error('Error uploading image:\n', error);
                        this.alert.error("Error processing  " + player.name + "'s photo.");
                    }
                });
            }

        });
        
        // this.api.updateTeamRoster(this.component_object.rostered).subscribe({
        //    next: (response:any) => {
        //         console.log(response);
        //    },
        //    error: (error:any) =>{
        //         console.log(error);
        //    }
        // });
        // this.api.uploadPlayerImage(this.pfp_new).subscribe({
        //     next: (response:any) => {
        //       console.log('Image uploaded successfully:\n', response);
        //     },
        //     error: (error:any) => {
        //       console.error('Error uploading image:\n', error);
        //       this.alertService.error(error);
        //     }
        //   });
    }
    kb_checkChanges() : any{
        if (JSON.stringify(this.copy_component_object.rostered) !== JSON.stringify(this.component_object.rostered)) {
            this.kb_save_changes = true;
          } else {
            this.kb_save_changes = false;
          }
    }

    /******************************************************************************************************
     * 
     * 
     *                      Clutch Event Modals
     * 
     * 
     * 
     *****************************************************************************************************/

    clutch_EventAttendModal(status_obj: any) {
        if (this.attending)
            this.attend = "Yes";
        else
            this.attend = "No";
        this.clutch.updateClutchEventData(status_obj.User, status_obj.Status.Date.toLocaleDateString(), this.attend).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
    }

    modal_AddLink() {
        this.link_Submit = true;

        //console.log(this.component_object);
        this.api.createLinkData(this.component_object).subscribe({
            next(response: any) {
                console.log(response);
            },
            error(error: any) {
                console.log(error)
            }
        });
        this.closeModal();
        setTimeout(() => {

            this.link_Submit = false;

        }, 5000);
    }
    modal_DeleteLink(id: number) {
        this.api.removeLinkData(id).subscribe({
            next(data: any) {
                console.log(data);
                this.modalService.getRefresh('clutch_section');
            },
            error(error: any) {
                console.log(error);
            }
        });
    }



    /*********************************************************************
     * 
     *  Auth admin 
     * 
     * 
     * 
     *********************************************************************/

    auth_RemoveRoleModal(id: number) {
        this.auth.removerole(id).subscribe({
            next(data: any) {
                console.log(data);
            },
            error(error: any) {
                console.log(error);
            }
        });
    }
    auth_AddRoleModal() {
        for (var profile of this.component_object.profiles)
            if (profile.checked) this.listAdd.push(profile.profile_id);
        this.auth.rolesregister(this.component_object.account_id, this.listAdd)
            .pipe(first())
            .subscribe({
                next(data: any) {
                    console.log(data);
                },
                error(error: any) {
                    console.log(error);
                }
            });
    }
}

