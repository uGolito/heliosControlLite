import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';
// pour test on web
import { DataService } from '../services/data/data.service';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanActive: boolean = false;
  qrContent: any;
  qrContentElement: any;

  //pour test api onWeb
  myResponse : any;

  constructor(private route: Router, private snackBar: MatSnackBar, private dataService: DataService) {}

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner.checkPermission({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        BarcodeScanner.openAppSettings();
        resolve(false);
      }
    });
  }

  async startScanner() {
    const allowed = await this.checkPermission();

    if (allowed) {
      this.scanActive = true;
      BarcodeScanner.hideBackground();

      const result = await BarcodeScanner.startScan();

      if (result.hasContent) {
        this.scanActive = false;
        this.qrContent = result.content;
        const qrContentArray = result.content?.split('#');
        // add condition pr verif id
        if (qrContentArray && qrContentArray[0] === 'HELIOS') {
          this.dataService.zoneId = qrContentArray[1];
          this.route.navigateByUrl('/pincode');
        } else {
          this.snackBar.open('Ce n\'est pas un QR code HELIOS', 'OK', {duration: 3000});
          this.route.navigateByUrl('/home');
        }
      } else {
        this.snackBar.open('Aucune donnée trouvée dans le code QR', 'OK', {duration: 3000});
      }
    } else {
      this.snackBar.open('L\'accès à la caméra n\'est pas autorisé', 'OK', {duration: 3000});
    }
  }

  stopScanner() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  ionViewWillLeave() {
    BarcodeScanner.stopScan();
    this.scanActive = false;
  }

  callApi() {
    this.dataService.apiRequest('building/single', { 'zoneId' : '61714a7923ccb226672366a6' }).subscribe(response => {
    this.myResponse = response;
    console.log(this.myResponse);
    })
  }
}