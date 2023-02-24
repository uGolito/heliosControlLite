import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PincodePageRoutingModule } from './pincode-routing.module';

import { PincodePage } from './pincode.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PincodePageRoutingModule
  ],
  declarations: [PincodePage]
})
export class PincodePageModule {}
