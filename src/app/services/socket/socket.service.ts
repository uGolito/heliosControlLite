import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  
  constructor(private socket: Socket) { }
  
  sendCommand(socketId: any, command: any) {
    console.log(command);
    this.socket.emit("command", {"socketId": socketId, "value": command });
  }

  setPower(alias: any, status: any) {
    this.socket.emit("power", {"alias": alias, "status": status});
  }
}
