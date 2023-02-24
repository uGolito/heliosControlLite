import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ThermostatPage } from './thermostat.page';

const routes: Routes = [
  {
    path: '',
    component: ThermostatPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ThermostatPageRoutingModule {}
