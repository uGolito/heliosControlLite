import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ConsumptionCounterPageRoutingModule } from './consumption-counter-routing.module';

import { ConsumptionCounterPage } from './consumption-counter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ConsumptionCounterPageRoutingModule
  ],
  declarations: [ConsumptionCounterPage]
})
export class ConsumptionCounterPageModule {}
