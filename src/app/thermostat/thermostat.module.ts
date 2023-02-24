import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ThermostatPageRoutingModule } from './thermostat-routing.module';

import { ThermostatPage } from './thermostat.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ThermostatPageRoutingModule
  ],
  declarations: [ThermostatPage]
})
export class ThermostatPageModule {}
