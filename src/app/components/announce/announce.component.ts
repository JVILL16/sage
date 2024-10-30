import { Component, OnInit,Input } from '@angular/core';
import { AlertService } from 'src/app/service/helpers/alert.service';
import { take, map } from 'rxjs/operators';
import { ApiService } from 'src/app/service/service.component';
import { BehaviorSubject } from 'rxjs';
import { LoadingService } from 'src/app/service/helpers/loading.service';

@Component({
    selector: 'announcement',
    templateUrl: './announce.component.html',
    styleUrls: ['./announce.component.css']
})

export class AnnounceComponent implements OnInit {

    @Input() p_name?: any = [];
    @Input() t_name?: any = [];

    constructor(private alert: AlertService, private api: ApiService, private load: LoadingService) { }


    ngOnInit(): void {
    }
}
