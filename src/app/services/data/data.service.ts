import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

const DATA_API = 'http://helios.dsc-security.be:7079/api/';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  zoneDetails = new Observable();

  httpOptions = { 
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };

  constructor(private http: HttpClient) { }

  apiRequest(path: string, data: any) {
    this.http.post(DATA_API + path, data, this.httpOptions);
    // la réponse sera mon observable
  }
}
