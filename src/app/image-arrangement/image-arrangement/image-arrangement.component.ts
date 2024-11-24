import { Component, effect, HostListener, inject, PLATFORM_ID, signal, WritableSignal } from '@angular/core';
import { ChtnkMakeImage } from '../model/chtnk-make-image';
import { FileHashService } from '../../shared/file-hash.service';
import { ImageArrangementService, ComicInfoService } from '../data-access';
import { isPlatformBrowser } from '@angular/common';
import { FileService } from '../data-access/file.service';
import { environment } from '../../../environments/environment.development';


@Component({
    selector: 'app-image-arrangement',
    templateUrl: './image-arrangement.component.html',
    styleUrl: './image-arrangement.component.scss',
    host: {
        '[style.--min-image-size]': 'minImageSize()+"px"'
    },
    standalone: false
})
export class ImageArrangementComponent {
  v = environment.version
  isMoveable: boolean = true;

  imgArrService = inject(ImageArrangementService)
  comicInfo = inject(ComicInfoService);
  fs = inject(FileService)
  fHash = inject(FileHashService)
  
  platformId = inject(PLATFORM_ID);
  isBrowser = isPlatformBrowser(this.platformId)
  minImageSize = signal(176)

  /**
   *
   */
  constructor() {
    effect(async () => {
      const files = this.fs.files()

      if (!files) return

      await this.filesHandler(files)

      this.fs.reset();
    })
  }

  async filesHandler(files: FileList) {
    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      const ab = (await file.arrayBuffer());
      const sha256 = this.fHash.getSHA256(ab)

      if (!sha256 || this.imgArrService.getImageBySha256(sha256)) continue;

      const blobUrl = URL.createObjectURL(file);
      const item = new ChtnkMakeImage(blobUrl, file.name, sha256)
      this.imgArrService.addImage(item)

    }
  }

  dir: WritableSignal<"ltr" | "rtl"> = signal("rtl")

  toggleDir() {
    this.dir.update(oldDir => (oldDir == "ltr") ? "rtl" : "ltr")
  }

  setRtl = () => this.dir.set('rtl')
  setLtr = () => this.dir.set('ltr')

  setMinSize(event: Event) {
    this.minImageSize.set(parseInt((event.target as HTMLInputElement).value))
  }

  async undo(undoIndex: number) {
    // TODO

    // const undoCount = (this.imgArrService.cm.history.length - (undoIndex + 2))

    // for (let i = 0; i <= undoCount; i++) {
    //   await this.imgArrService.cm.undo()
    // }

  }

  async redo(redoIndex: number) {
    // TODO
    
    // const redoCount = Math.abs(((redoIndex + 1) - this.imgArrService.cm.executeCommand.length))

    // for (let i = 0; i <= redoCount; i++) {
    //   await this.imgArrService.cm.redo()
    // }

  }

  hotKeys = new Map<string, Function>()
    .set("Ctrl+KeyS", this.imgArrService.downloadZip.bind(this.imgArrService))
    .set("Ctrl+KeyZ", this.imgArrService.undo.bind(this.imgArrService))
    .set("Ctrl+KeyY", this.imgArrService.redo.bind(this.imgArrService))
    .set("Ctrl+Shift+KeyZ", this.imgArrService.redo.bind(this.imgArrService))
    .set("Ctrl+KeyR", this.setRtl.bind(this))
    .set("Ctrl+KeyL", this.setLtr.bind(this))

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const target = event.target as HTMLElement;

    if (["INPUT", "SELECT", "TEXTAREA", "BUTTON"].includes(target.nodeName)) return;

    const code = [
      event.ctrlKey && 'Ctrl',
      event.shiftKey && 'Shift',
      event.altKey && 'Alt',
      event.code
    ].filter(Boolean).join('+');

    const action = this.hotKeys.get(code);

    if (action) {
      event.preventDefault();
      action();
    }

  }
}
