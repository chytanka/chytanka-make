import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageArrangementComponent } from './image-arrangement/image-arrangement.component';
import { ImageArrangementRoutingModule } from './image-arrangement-routing.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ComicInfoComponent } from './comic-info/comic-info.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { FileChangeComponent } from './file-change/file-change.component';
import { TruncatePipe } from '../shared/truncate.pipe';


@NgModule({
  declarations: [
    ImageArrangementComponent,
    ComicInfoComponent,
    FileChangeComponent
  ],
  imports: [
    CommonModule,
    ImageArrangementRoutingModule,
    DragDropModule,
    FormsModule,
    ReactiveFormsModule, TruncatePipe
  ]
})
export class ImageArrangementModule { }
