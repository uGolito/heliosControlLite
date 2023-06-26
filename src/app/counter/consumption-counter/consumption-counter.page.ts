import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { NavController } from '@ionic/angular';
import * as Tesseract from 'tesseract.js';
import { createWorker } from 'tesseract.js';
import * as cv from "@techstark/opencv-js";

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
  numValues: string[] = [];
  num2Values: string[] = [];
  ocrDigitsNumber: any;

  constructor(public navCtrl: NavController, private route: Router) {
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
    this.worker = await createWorker();

    await this.worker?.loadLanguage('fra');
    await this.worker?.initialize('fra');

    this.workerReady = true;
  }

  async recognizeImages() {
    const src = cv.imread(this.image);
    const dst = new cv.Mat();
    cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
    cv.threshold(dst, dst, 0, 255, cv.THRESH_BINARY | cv.THRESH_OTSU);
    const contours = new cv.MatVector();
    const hierarchy = new cv.Mat();
    cv.findContours(dst, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    const boundingRectangles: cv.Rect[] = [];
    for (let i = 0; i < contours.size().height; i++) {
      const contour = contours.get(i);
      const boundingRect = cv.boundingRect(contour);
      boundingRectangles.push(boundingRect);
    }

    boundingRectangles.sort((a, b) => a.x - b.x);

    const result = await this.worker?.recognize(this.image);
    this.ocrResult = result?.data.text.replace(/\D/g, "");

    const ocrText = this.ocrResult || '';
    const ocrChars = Array.from(ocrText);

    for (let i = 0; i < boundingRectangles.length; i++) {
      const boundingRect = boundingRectangles[i];
      const centerX = boundingRect.x + boundingRect.width / 2;
      const charIndex = Math.floor(centerX / (src.cols / ocrChars.length));

      const character = ocrChars[charIndex];
      if (character) {
        if (boundingRect.width > boundingRect.height) {
          this.numValues.push(character);
        } else {
          this.num2Values.push(character);
        }
      }
    }

    this.formatNumberToObject(Number(this.ocrResult));

    // Mettre à jour les valeurs des index utilisées pour les bindings des inputs
    for (let i = 0; i < this.numValues.length; i++) {
      this.index[i] = this.numValues[i];
    }

    for (let i = 0; i < this.num2Values.length; i++) {
      this.index[6 + i] = this.num2Values[i];
    }

    src.delete();
    dst.delete();
    contours.delete();
    hierarchy.delete();
  }

  formatNumberToObject(num: number) {
    if (!num) {
      num = 0;
    }
    let parts = num.toFixed(3).split('.');
    let wholePart = parts[0].padStart(6, '0');
    let decimalPart = parts[1];
    this.numValues = Array.from(wholePart);
    this.num2Values = Array.from(decimalPart);
  }

  enterDigits() {
    this.navCtrl.navigateRoot('/input-comsuption');
  }

  joinedValues: any;

  numbers: any[] = [0, 0, 0, 0, 0]; // Tableau pour stocker les nombres
  decimals: number[] = [0, 0, 0]; // Tableau pour stocker les décimales
  index = ['', '', '', '', '', '', ''];

  addNumValue(value: string) {
    this.numValues.push(value);
  }

  addNum2Value(value: string) {
    this.num2Values.push(value);
  }

  getJoinedValues() {
    this.joinedValues = this.numValues.join('') + ',' + this.num2Values.join('');
    console.log(this.joinedValues);
  }

  navigation(url: string) {
    this.route.navigate(['/' + url]);
  }

  maFonction(code: any) {
    document.getElementById('code' + code)?.focus();
  }

  maFonction2(code: any) {
    this.index[code] = '';
  }
}
