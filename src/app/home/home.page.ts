import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BarcodeScanner } from '@capacitor-community/barcode-scanner';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  scanActive: boolean = false;
  qrContent: any;
  qrContentElement: any;

  constructor(private route: Router, private snackBar: MatSnackBar) {}

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
        if (qrContentArray && qrContentArray[0] === 'helios') {
          this.route.navigateByUrl('/pincode');
        } else {
          this.snackBar.open('Le code QR n\'est pas bon', 'OK', {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            politeness: 'polite',
            panelClass: ['custom-snackbar']
          });
          this.route.navigateByUrl('/home');
        }
      } else {
        this.snackBar.open('Aucune donnée trouvée dans le code QR', 'OK', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          politeness: 'polite',
          panelClass: ['custom-snackbar']
        });
      }
    } else {
      this.snackBar.open('L\'accès à la caméra n\'est pas autorisé', 'OK', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        politeness: 'polite',
        panelClass: ['custom-snackbar']
      });
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
}