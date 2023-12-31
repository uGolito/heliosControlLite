import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  buildingDetails : any;
  
  constructor(private socket: Socket, public dataService : DataService) { 
    this.socket.on('datas', (message : any) => {
      if (message.type == "update") {
        if (message.zoneData && this.buildingDetails) {
          this.buildingDetails.zone.heating = message.zoneData;
          this.dataService.buildingDetails.next(this.buildingDetails);
        }
      }
      if (message.type == "power") {
        if (message.deviceData && this.buildingDetails) {
          this.buildingDetails.zone.heating.power = message.deviceData.power;
          this.dataService.buildingDetails.next(this.buildingDetails);
        }
      }
      if ( message.type == "preset") {
        if (message.deviceData && this.buildingDetails) {
          this.buildingDetails.zone.heating.desiredTemp = message.deviceData.desiredTemp;
          this.buildingDetails.zone.heating.preset = message.deviceData.preset;
          this.dataService.buildingDetails.next(this.buildingDetails);
        }
      }
    })
    this.dataService.buildingDetails.subscribe((buildingDetails:any)  => {
      if (buildingDetails) {
        this.buildingDetails = buildingDetails;
      }
    })
  }

  sendCommand(serial: any, command: any) {
    this.socket.emit("command", {"serial": serial, "value": command });
  }

  setPower(id: any, status: any) {
    this.socket.emit("power", {"socketId": this.socket.ioSocket.id, "zoneId": id, "status": status});
  }

  zoneSubscribe(zones: any) {
    this.socket.emit("zoneSubscription", {'socketId': this.socket.ioSocket.id, 'zoneId': zones });
  }

  zoneUnsubscribe() {
    this.socket.emit("subscription", {'zoneId': []});
  }

  setPreset(id: any, desiredTemp: any, preset: any) {
    this.socket.emit("preset", {"socketId": this.socket.ioSocket.id, "zoneId": id, "desiredTemp": desiredTemp, "preset": preset});
  }
}

