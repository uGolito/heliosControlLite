// import { Component } from '@angular/core';
// import { Router } from '@angular/router';
// import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
// import { NavController } from '@ionic/angular';
// import * as Tesseract from 'tesseract.js';
// import { createWorker } from 'tesseract.js';


// @Component({
//   selector: 'app-consumption-counter',
//   templateUrl: './consumption-counter.page.html',
//   styleUrls: ['./consumption-counter.page.scss'],
// })
// export class ConsumptionCounterPage {
//   ocrResult: string | undefined;
//   worker: Tesseract.Worker | undefined;
//   workerReady = false;
//   image: any;

//   constructor(public navCtrl: NavController, private route: Router) {
//     this.loadWorker();
//    }

//   async takePhoto() {
//     const image = await Camera.getPhoto({
//       quality: 90,
//       allowEditing: true,
//       resultType: CameraResultType.DataUrl,
//       source: CameraSource.Camera,
//     });
//     console.log(image);
//     this.image = image.dataUrl;
//   }
  
//   async loadWorker() {
//     this.worker = await createWorker();
    
//     await this.worker?.loadLanguage('fra');
//     await this.worker?.initialize('fra');

//     this.workerReady = true;
//   }

//   async recognizeImages() {
//   const result = await this.worker?.recognize(this.image);
//   this.ocrResult = result?.data.text.replace(/\D/g, "");
//   const ocrDigits = this.ocrResult?.split('');
//   // Réinitialiser les tableaux des valeurs
//   this.numValues = [];
//   this.num2Values = [];
//   // Remplir les valeurs des numValues
//   if (ocrDigits && ocrDigits.length > 0) {
//     for (let i = 0; i < 6; i++) {
//       if (ocrDigits[i]) {
//         this.numValues.push(ocrDigits[i]);
//       } else {
//         this.numValues.push('0');
//         this.num2Values.push('0');
//       }
//     }
//   }
//   // Remplir les valeurs des num2Values
//   if (ocrDigits && ocrDigits.length >= 6) {
//     for (let i = 6; i < 9; i++) {
//       if (ocrDigits[i]) {
//         this.num2Values.push(ocrDigits[i]);
//       } else {
//         this.num2Values.push('0');
//       }
//     }
//   }
//   // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
//     for (let i = 0; i < this.numValues.length; i++) {
//       this.index[i] = this.numValues[i];
//     }
//     for (let i = 0; i < this.num2Values.length; i++) {
//       this.index[6 + i] = this.num2Values[i];
//     }
//   }   

//   enterDigits() {
//     this.navCtrl.navigateRoot('/input-comsuption');
//   }


//   numValues: string[] = [];
//   num2Values: string[] = [];
//   joinedValues: any;

//   numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
//   decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
//   index = ['','','','','','',''];

//   addNumValue(value: string, index: number) {
//     console.log(value);
//     this.numValues[index] = value;
//   }

//   addNum2Value(value: string, index : number) {
//     this.num2Values[index] = value;
//   }

//   getJoinedValues() {
//     this.joinedValues = this.numValues.join('')+','+this.num2Values.join('');
//     console.log(this.joinedValues);
//   }

//   ngOnInit() {
//   }

//   navigation(url : String) {
//     this.route.navigate(['/'+url]);
//   }

//   maFonction(code: any) {
//     document.getElementById('code'+code);    
//   }

//   maFonction2(code: any) {
//     this.index[code] = '';
//   }

// }

import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CameraPreview, CameraPreviewOptions, CameraPreviewPictureOptions } from '@capacitor-community/camera-preview';
import { matFromImageData, cvtColor, COLOR_RGBA2GRAY, resize, adaptiveThreshold, bitwise_not, findContours, drawContours, contourArea } from '@techstark/opencv-js';
import * as Tesseract from 'tesseract.js';

@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage implements AfterViewInit {
  @ViewChild('previewCanvas', { static: false }) previewCanvas!: ElementRef;
  ocrResult: any;

  private cameraPreviewOpts: CameraPreviewOptions = {
    position: 'rear',
    parent: 'camera-preview-container',
    width: window.innerWidth,
    height: window.innerHeight,
    toBack: true,
  };

  private captureOpts: CameraPreviewPictureOptions = {
    quality: 90,
  };

  async ngAfterViewInit() {
    await CameraPreview.start(this.cameraPreviewOpts);
  }
  async capturePhoto() {
    const image = await CameraPreview.capture(this.captureOpts);
    const imagePath = image.value;
  
    const croppedImage = this.cropImage(imagePath);
    if (croppedImage !== undefined) {
      const ocrResult = await this.performOCR(croppedImage);
      this.ocrResult = ocrResult;
      console.log('OCR Result:', ocrResult); // Affiche le résultat de l'OCR dans la console
    } else {
      console.error('Erreur lors du recadrage de l\'image');
    }
  }
  
  async cropImage(imagePath: string): Promise<string | undefined> {
    return new Promise<string | undefined>((resolve, reject) => {
      const imageElement = new Image();
      imageElement.onload = async () => {
        const canvas = this.previewCanvas.nativeElement;
        const context = canvas.getContext("2d");
        context.drawImage(imageElement, 0, 0, canvas.width, canvas.height);
  
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const src = matFromImageData(imageData);
  
        const gray = new cv.Mat();
        cvtColor(src, gray, COLOR_RGBA2GRAY);
  
        const thresholded = new cv.Mat();
        adaptiveThreshold(gray, thresholded, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);
  
        const inverted = new cv.Mat();
        bitwise_not(thresholded, inverted);
  
        const contours = new cv.MatVector();
        const hierarchy = new cv.Mat();
        findContours(inverted, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);
  
        let largestContourArea = 0;
        let largestContourIndex = -1;
        const contoursSize = contours.size();
        const desiredArea = 200; // Surface minimale du contour (en pixels carrés)
        for (let i = 0; i < contoursSize.height; i++) {
          const contour = contours.get(i);
          const area = contourArea(contour, false);
          if (area > largestContourArea && area < desiredArea) {
            largestContourArea = area;
            largestContourIndex = i;
          }
        }
  
        const result = new cv.Mat();
        drawContours(src, contours, largestContourIndex, [0, 255, 0, 255], 2, cv.LINE_8, hierarchy, 0);
  
        const width = 200; // Largeur du rectangle (en pixels)
        const height = 20; // Hauteur du rectangle (en pixels)
        const desiredSize = new cv.Size(width, height);
  
        // Resize the image
        const resized = new cv.Mat();
        cv.resize(src, resized, desiredSize, 0, 0, cv.INTER_LINEAR);

        // Convert resized image to data URL string
        const resizedCanvas = document.createElement('canvas');
        cv.imshow(resizedCanvas, resized);
        const resizedDataUrl = resizedCanvas.toDataURL();

        // Resolve the promise with the resized image data URL
        resolve(resizedDataUrl);
      };
      imageElement.src = imagePath;
    });
  }
  

  performOCR(image: any) {
    // Code for performing OCR on the cropped image
    // Replace this with your OCR implementation
  
    // Example code using Tesseract.js for OCR
    Tesseract.recognize(image)
      .then(({ data }) => {
        this.ocrResult = data.text;
      })
      .catch((error) => {
        console.error('OCR error:', error);
      });
  }
}


  

