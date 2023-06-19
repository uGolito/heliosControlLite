import { Component, OnInit } from '@angular/core';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';
import { OCR, OCRResult, OCRSourceType } from '@awesome-cordova-plugins/ocr/ngx';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage implements OnInit {
  decodedText: string = '';

  constructor(private ocr: OCR) { }

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
    this.ocr.recText(OCRSourceType.NORMFILEURL, image)
      .then((res: OCRResult) => {
        this.decodedText = JSON.stringify(res);
        console.log(JSON.stringify(this.decodedText))
      })
      .catch((error: any) => console.error(error));
  }



  enterDigits() {
    // Affichez une boîte de dialogue pour entrer les chiffres manuellement ici
    // Vous pouvez utiliser une bibliothèque comme Ionic AlertController pour cela
  }

  ngOnInit() {
  }

}
