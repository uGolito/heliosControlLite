import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
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

  zoneSubscription!: Subscription;

  constructor(private route: Router, private dataService: DataService) { }

  ngOnInit() {
    //this.zoneSubscription.s
  }

  onConfirm() {
    this.dataService.apiRequest('/zone/details', this.code);
    this.showCode = false;
    this.route.navigate(['/thermostat']);
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
}
}

