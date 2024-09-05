import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../helpers/alert.service'
import { ChildActivationEnd, NavigationEnd, Router } from '@angular/router';

@Component({
    selector: 'alert',
    templateUrl: './alert.component.html',
    styleUrls: ['./alert.component.css']
})

export class AlertComponent implements OnInit, OnDestroy {
    private subscription!: Subscription;
    private clearSubscription!: Subscription;
    messages: any=[];
    

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        
        this.subscription = this.alertService.getMessage().subscribe(message => { 
            message?.type == 'clear' ? this.messages = [] : this.messages.push(message);
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}