import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { DataService } from '../../services/data/data.service';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.page.html',
  styleUrls: ['./pincode.page.scss'],
})
export class PincodePage implements OnInit {
  showCode = false;
  code = '';
  myResponse : any;
  zoneSubscription!: Subscription;

  constructor(private route: Router, private dataService: DataService) { }

  ngOnInit() {
    //this.zoneSubscription.s
  }

  // MODIFIER le code par this.code après
  onConfirm() {
    this.dataService.apiRequest('building/single', { 'zoneId' : '61714a7923ccb226672366a6' }).subscribe(response => {
      if (response['message'].status == 200) {
        this.dataService.zoneDetails.next(response['message'].zone);
        this.myResponse = response['message'].zone;
      }
    })
    this.showCode = false;
    this.route.navigate(['/thermostat']);
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }
}

