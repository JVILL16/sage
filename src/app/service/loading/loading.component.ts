import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoadingService } from '../helpers/loading.service'
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})

export class LoadingComponent  {

    

    // show(): any {
    //     this.loading = true;
    //     return true;
    // }
    // hide(): any {
        
    //     this.loading = false;
    //     return false;
    // }

    // ngOnDestroy(): void {
    //     throw new Error("Method not implemented.");
    // }

    // ngOnInit(): void {

    //     throw new Error("Method not implemented.");
    // }
    private subscription!: Subscription;
    loading: boolean = false;
    

    constructor(private loadService: LoadingService) { }

    ngOnInit() {
        this.subscription = this.loadService.getLoadStatus.subscribe((status:any) => { 
            this.loading = status.status; 
            console.log(status.component);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}