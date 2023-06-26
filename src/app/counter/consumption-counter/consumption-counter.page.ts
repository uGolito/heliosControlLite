import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
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
  showOverlay = false;
  canvas: HTMLCanvasElement | null = null;
  imgElement: HTMLIonImgElement | null = null;

  constructor(public navCtrl: NavController, private route: Router) {
    this.loadWorker();
   }

  // async takePhoto() {
  //   const image = await Camera.getPhoto({
  //     quality: 90,
  //     allowEditing: true,
  //     resultType: CameraResultType.DataUrl,
  //     source: CameraSource.Camera,
  //   });
  //   console.log(image);
  //   this.showOverlay = true;
  //   this.image = image.dataUrl;
  // }
  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.DataUrl,
      source: CameraSource.Camera,
    });

    this.image = image.dataUrl;
    this.showOverlay = true;
    this.canvas = null; // Réinitialise le canvas lors de la capture d'une nouvelle photo
  }

  toggleOverlay() {
    this.showOverlay = !this.showOverlay;
    if (this.showOverlay) {
      this.canvas = document.createElement('canvas');
      const imgElement = document.querySelector('ion-img');
      if (this.canvas && imgElement) {
        const img = new Image();
        img.src = this.imgElement?.getAttribute('src') || '';
        img.onload = () => {
          this.canvas!.width = img.width;
          this.canvas!.height = img.height;
          const ctx = this.canvas!.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, this.canvas!.width, this.canvas!.height);
          }
        };
      }
    } else {
      if (this.canvas) {
        this.canvas.remove();
        this.canvas = null;
      }
    }
  }

  async loadWorker() {
    this.worker = await createWorker();
    
    await this.worker?.loadLanguage('fra');
    await this.worker?.initialize('fra');

    this.workerReady = true;
  }

  // async recognizeImages() {
  // const result = await this.worker?.recognize(this.image);
  // this.ocrResult = result?.data.text.replace(/\D/g, "");
  // const ocrDigits = this.ocrResult?.split('');
  
  // // Réinitialiser les tableaux des valeurs
  // this.numValues = [];
  // this.num2Values = [];

  // // Remplir les valeurs des numValues
  // if (ocrDigits && ocrDigits.length > 0) {
  //   for (let i = 0; i < 6; i++) {
  //     if (ocrDigits[i]) {
  //       this.numValues.push(ocrDigits[i]);
  //     } else {
  //       this.numValues.push('0');
  //       this.num2Values.push('0');
  //     }
  //   }
  // }

  // // Remplir les valeurs des num2Values
  // if (ocrDigits && ocrDigits.length >= 6) {
  //   for (let i = 6; i < 9; i++) {
  //     if (ocrDigits[i]) {
  //       this.num2Values.push(ocrDigits[i]);
  //     } else {
  //       this.num2Values.push('0');
  //     }
  //   }
  // }

  // // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
  //   for (let i = 0; i < this.numValues.length; i++) {
  //     this.index[i] = this.numValues[i];
  //   }

  //   for (let i = 0; i < this.num2Values.length; i++) {
  //     this.index[6 + i] = this.num2Values[i];
  //   }
  // }   

  async recognizeImages() {
    if (this.showOverlay && this.canvas) {
      const ctx = this.canvas.getContext('2d');
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const croppedCanvas = document.createElement('canvas');
        const croppedCtx = croppedCanvas.getContext('2d');
        if (croppedCtx) {
          const frame = document.querySelector('.photo-frame');
          if (frame) {
            const frameRect = frame.getBoundingClientRect();
            croppedCanvas.width = frameRect.width;
            croppedCanvas.height = frameRect.height;
            croppedCtx.putImageData(
              imageData,
              frameRect.left,
              frameRect.top,
              0,
              0,
              frameRect.width,
              frameRect.height
            );
            const croppedImage = croppedCanvas.toDataURL('image/jpeg');
            this.image = croppedImage;
          }
        }
      }
    }
  
    const result = await this.worker?.recognize(this.image);
    this.ocrResult = result?.data.text.replace(/\D/g, "");
    const ocrDigits = this.ocrResult?.split('');
  
    // Réinitialiser les tableaux des valeurs
    this.numValues = [];
    this.num2Values = [];
  
    // Remplir les valeurs des numValues
    if (ocrDigits && ocrDigits.length > 0) {
      for (let i = 0; i < 6; i++) {
        if (ocrDigits[i]) {
          this.numValues.push(ocrDigits[i]);
        } else {
          this.numValues.push('0');
          this.num2Values.push('0');
        }
      }
    }
  
    // Remplir les valeurs des num2Values
    if (ocrDigits && ocrDigits.length >= 6) {
      for (let i = 6; i < 9; i++) {
        if (ocrDigits[i]) {
          this.num2Values.push(ocrDigits[i]);
        } else {
          this.num2Values.push('0');
        }
      }
    }
  
    // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
    for (let i = 0; i < this.numValues.length; i++) {
      this.index[i] = this.numValues[i];
    }
  
    for (let i = 0; i < this.num2Values.length; i++) {
      this.index[6 + i] = this.num2Values[i];
    }
  
    this.showOverlay = false;
  }
  

  enterDigits() {
    this.navCtrl.navigateRoot('/input-comsuption');
  }


  numValues: string[] = [];
  num2Values: string[] = [];
  joinedValues: any;

  numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
  index = ['','','','','','',''];

  addNumValue(value: string) {
    this.numValues.push(value);
  }

  addNum2Value(value: string) {
    this.num2Values.push(value);
  }

  getJoinedValues() {
    this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
    console.log(this.joinedValues);
  }

  ngOnInit() {
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
  }

  maFonction(code: any) {
    document.getElementById('code'+code);    
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }

}




  

