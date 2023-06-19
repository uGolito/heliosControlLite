import { Component, OnInit } from '@angular/core';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import * as Tesseract from 'tesseract.js';
import { createCanvas, loadImage } from 'canvas';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage implements OnInit {
  decodedText: string = '';

  constructor() { }

  async takePhoto() {
    const { Camera } = Plugins;
  
    const image = await Camera['getPhoto']({
      quality: 90,
      allowEditing: true,
      resultType: CameraResultType.Base64,
      source: CameraSource.Camera,
      width: 300, 
      height: 1 
    });

    // OCR photo
    async function performOCR(imageData: string) {
      const img = await loadImage(imageData);
      const canvas = createCanvas(img.width, img.height);
      const context = canvas.getContext('2d');
    
    
      if (context) {
        context.drawImage(img, 0, 0);
    
        const buffer = canvas.toBuffer('image/png');
        const { data } = await Tesseract.recognize(buffer);
        const decodedText = data.text.trim();
    
        // Use decodedText as needed
      } else {
        console.error('Unable to get 2D context for canvas.');
      }
    }
      // Use decodedText as needed
    
  }



  enterDigits() {
    // Affichez une boîte de dialogue pour entrer les chiffres manuellement ici
    // Vous pouvez utiliser une bibliothèque comme Ionic AlertController pour cela
  }

  ngOnInit() {
  }

}
