import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImageArrangementComponent } from './image-arrangement/image-arrangement.component';

const routes: Routes = [
  {
    path: '',
    component: ImageArrangementComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImageArrangementRoutingModule { }