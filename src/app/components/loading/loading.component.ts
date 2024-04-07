import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrls: ['./loading.component.css']
})

export class LoadingComponent  {

    loading: boolean = false;

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

}