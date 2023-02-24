import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PincodePage } from './pincode.page';

const routes: Routes = [
  {
    path: '',
    component: PincodePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PincodePageRoutingModule {}
