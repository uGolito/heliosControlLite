import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import { Router } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { SocketService } from '../services/socket/socket.service';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {

  lastTemp = 0;
  desiratedTemp = 0;
  power:boolean = true;
  zone : any;
  building: any;

  component = HomePage;
  id: any;
  status: any;
  constructor(private route : Router, private dataService : DataService, private socket : Socket) { }

  ngOnInit() {
    this.dataService.buildingDetails.subscribe(buidingDetails => {
      if (buidingDetails) {
        console.log('changement buildingDetails (thermostat)');
        this.zone = buidingDetails['zone'];
        this.building = buidingDetails['building']
      }
    })
  }

  upTemp() {
    if (this.power) {
      this.desiratedTemp++;
    } 
  }

  downTemp() {
    if (this.power) {
      this.desiratedTemp--;
    } 
  }

  turnPower(id: any) {
    this.power = !this.power;
    this.socket.emit("power", {"socketId": this.socket.ioSocket.id, "zoneId": id, "status": this.power});
    if (!this.power) {
      document.getElementById("btn-power")?.setAttribute("class", "fa-solid fa-3x fa-power-off");
    }
    else {
      document.getElementById("btn-power")?.setAttribute("class", "fa-solid fa-power-off");
    }
  }
}

