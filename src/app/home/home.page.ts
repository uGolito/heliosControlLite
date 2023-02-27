import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Plugins } from '@capacitor/core';
const { BarcodeScanner } = Plugins;

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  constructor(private alerController: AlertController) {}

  async startScanner () {
      await this.checkPermission();
      const result = await BarcodeScanner['startScan']();
  }

  async checkPermission() {
    return new Promise(async (resolve, reject) => {
      const status = await BarcodeScanner['checkPermission']({ force: true });
      if (status.granted) {
        resolve(true);
      } else if (status.denied) {
        const alert = await this.alerController.create({
          header: 'No permission',
          message: 'Please allow camera access in your settings',
          buttons: [{
            text: 'No',
            role: 'cancel'
          },
        {
          text: 'Open Settings',
          handler: () => {
            BarcodeScanner['openAppSettings']();
            resolve(false);
          }
        }]
      });
      await alert.present();
      } else {
        resolve(false);
      }
    });   
  }
}
