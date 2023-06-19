import { Component, OnInit } from '@angular/core';
import { CameraResultType, CameraSource, Camera } from '@capacitor/camera';
import { Plugins } from '@capacitor/core';


@Component({
  selector: 'app-consumption-counter',
  templateUrl: './consumption-counter.page.html',
  styleUrls: ['./consumption-counter.page.scss'],
})
export class ConsumptionCounterPage implements OnInit {

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
  }



  enterDigits() {
    // Affichez une boîte de dialogue pour entrer les chiffres manuellement ici
    // Vous pouvez utiliser une bibliothèque comme Ionic AlertController pour cela
  }

  ngOnInit() {
  }

}
