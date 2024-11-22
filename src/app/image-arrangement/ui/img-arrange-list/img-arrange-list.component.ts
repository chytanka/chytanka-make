import { Component, EventEmitter, inject, input, Output, PLATFORM_ID } from '@angular/core';
import { ImageArrangementService } from '../../data-access';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-img-arrange-list',
    templateUrl: './img-arrange-list.component.html',
    styleUrl: './img-arrange-list.component.scss',
    standalone: false
})
export class ImgArrangeListComponent {
  dir = input<"ltr" | "rtl">("rtl")
  isMoveable = input<boolean>(true)
  imgArrService = inject(ImageArrangementService)

  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId)

  @Output() toggleDir = new EventEmitter();

  onToggleDir() {
    this.toggleDir.emit()
  }

}
