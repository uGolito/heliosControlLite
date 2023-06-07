import { Component, OnInit } from '@angular/core';
import { HomePage } from '../home/home.page';
import { Router } from '@angular/router';
import { DataService } from '../services/data/data.service';
import { SocketService } from '../services/socket/socket.service';

@Component({
  selector: 'app-thermostat',
  templateUrl: './thermostat.page.html',
  styleUrls: ['./thermostat.page.scss'],
})
export class ThermostatPage implements OnInit {

  lastTemp = 0;
  desiredTemp = 0;
  power:boolean = true;
  zone : any;
  building: any;
  displayTemp = 0;

  component = HomePage;
  id: any;
  status: any;
  constructor(private route : Router, private dataService : DataService, private socketService : SocketService) { }

  ngOnInit() {
    this.dataService.buildingDetails.subscribe(buildingDetails => {
      if (buildingDetails) {
        this.zone = buildingDetails['zone'];
        this.building = buildingDetails['building'];
        this.power = buildingDetails['zone']['heating']['power'];
        this.desiredTemp = buildingDetails['zone']['heating']['desiredTemp'];
      }
    })
  }

  sendCommandPlus(id: string) {
    if (this.power) {
      this.displayTemp = this.zone.heating.desiredTemp;
      while (this.displayTemp <= 28) {
        this.displayTemp++;
        if ((this.zone.heating.desiredTemp - this.zone.heating.calendarTemp) < 2) {
          this.zone.heating.desiredTemp++;
          this.socketService.setPreset(id, this.zone.heating.desiredTemp, "bypass");
        }
      }
    } 
  }

  sendCommandMinus(id: string) {
    if (this.power && this.zone.heating.desiredTemp > 0) {
      this.zone.heating.desiredTemp--;
      this.socketService.setPreset(id, this.zone.heating.desiredTemp, "bypass");
    } 
  }

  turnPower(id: any) {
    this.power = !this.power;
    this.socketService.setPower(id, this.power);
  }
}

