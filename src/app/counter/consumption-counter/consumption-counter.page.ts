import { Component } from '@angular/core';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { create } from 'domain';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage {
  ocrResult: string | undefined;
  worker: Tesseract.Worker | undefined;
  workerReady = false;
  image: any;

  constructor() {
    this.loadWorker();
   }

  async takePhoto() {  
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });
    console.log(image);
    this.image = image.dataUrl;
  }

  async loadWorker() {
    this.worker = await createWorker({
      logger: progress => {
        console.log(progress);
        console.log("fin");
      }
    })
    await this.worker?.load();
    await this.worker?.loadLanguage('fra');
    await this.worker?.initialize('fra');
    this.workerReady = true;
  }

  async recognizeImages() {
    const result = await this.worker?.recognize(this.image);
    console.log("test");
    this.ocrResult = result?.data.text;
  }

  enterDigits() {
    // Affichez une boîte de dialogue pour entrer les chiffres manuellement ici
    // Vous pouvez utiliser une bibliothèque comme Ionic AlertController pour cela
  }

  

}
