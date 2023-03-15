import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { SocketService } from 'src/app/services/socket/socket.service';
import { DataService } from '../../services/data/data.service';
import { first } from 'rxjs';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.page.html',
  styleUrls: ['./pincode.page.scss'],
})
export class PincodePage implements OnInit {
  code :any;
  myResponse : any;
  zoneSubscription!: Subscription;
  pincode = ['','','','']

  constructor(private route: Router, private dataService: DataService, private socketService : SocketService) { }

  ngOnInit() {
    this.code = this.dataService.zoneId;
  }

  // id'61714a7923ccb226672366a6'   -> this.code
  onConfirm() {
    let codePin = this.pincode.join(""); 
    console.log(codePin);
    this.dataService.apiRequest('building/single', { 'zoneId' : '61714a7923ccb226672366a6', 'pincode' : codePin}).pipe(first()).subscribe(response => {
      console.log(response);
      if (response['message'].status == 401) {
        console.log('erreur de pin');
        // snackbar code pin pas bon
      }
      if (response['message'].status == 200) {
        this.dataService.buildingDetails.next(response['message']);
        this.myResponse = response['message'].zone;
        this.socketService.zoneSubscribe([this.myResponse._id]);
        this.route.navigate(['/thermostat']);
      }
      // snackbar mauvaise piece
    })    
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }

}

