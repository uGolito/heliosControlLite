import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-pincode',
  templateUrl: './pincode.page.html',
  styleUrls: ['./pincode.page.scss'],
})
export class PincodePage implements OnInit {
  showCode = false;
  code = '';

  constructor(private navCtrl: NavController, private route: Router) { }

  ngOnInit() {
  }

  onConfirm() {
    // Ajoutez ici la logique pour vérifier le code et prendre une action
    console.log('Code entré :', this.code);
    this.showCode = false;
    this.route.navigate(['/thermostat']);
  }

  navigation(url : String) {
    this.route.navigate(['/'+url]);
}
}

