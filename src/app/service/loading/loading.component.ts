import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { LoadingService } from '../helpers/loading.service'
import { Observable, Subscription } from 'rxjs';

@Component({
    selector: 'loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})

export class LoadingComponent  {

    @Input() isLoading$?: boolean = false;

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
     private miniSubscription!: Subscription;
    loading: boolean = false;
    mini_loading: boolean = false;
    

    constructor(private loadService: LoadingService) { }

    ngOnInit() {
        this.subscription = this.loadService.getLoadStatus.subscribe((data:any) => { 
            this.loading = data.status; 
            console.log(data.component);
        });
        this.miniSubscription = this.loadService.getMiniLoadStatus.subscribe((data:any) => { 
            this.mini_loading = data.status; 
            console.log(data.component);
        });
        console.log(this.isLoading$);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
        this.miniSubscription.unsubscribe();
    }

}