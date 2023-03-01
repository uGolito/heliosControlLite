import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import {  } from 'rxjs';

// old API COMPLETE const DATA_API = 'http://helios.dsc-security.be:7079/api/';
// new API COMPLETE const DATA_API = 'https://v2.helioscontrol.com/webapi/api/';
const DATA_API = 'https://v2.helioscontrol.com/webapi/api/';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  public zoneDetails = new BehaviorSubject(null);

  httpOptions = { 
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  apiRequest(path: string, data: any):Observable<any> {
    return this.http.post(DATA_API + path, data, this.httpOptions);
  }
}
