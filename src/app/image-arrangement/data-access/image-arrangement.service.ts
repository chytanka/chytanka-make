import { inject, Injectable, signal } from '@angular/core';
import { CommandManager } from '../../shared/command-manager';
import { ChtnkMakeImage, IChtnkMakeImage } from '../model/chtnk-make-image';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import JSZip from 'jszip';

import {
  ImgArrangeAddCommand,
  ImgArrangeMoveCommand,
  ImgArrangeRemoveCommand,
  ImgArrangeSortCommand,
  ImgArrangeSplitCommand,
} from '../commands';
import { ComicInfoService } from './comic-info.service';

@Injectable({
  providedIn: 'root'
})
export class ImageArrangementService {
  comicInfo = inject(ComicInfoService);
  imageList = signal<ChtnkMakeImage[]>([]);
  cm = new CommandManager();

  addImage(item: IChtnkMakeImage): void {
    const cmd = new ImgArrangeAddCommand(this.imageList, item);
    this.cm.executeCommand(cmd);
  }

  moveImage(event: CdkDragDrop<string[]>) {
    if (event.previousIndex === event.currentIndex) return;

    const cmd = new ImgArrangeMoveCommand(this.imageList, event.previousIndex, event.currentIndex)
    this.cm.executeCommand(cmd);
  }

  removeImage(sha256: string): void {
    const cmd = new ImgArrangeRemoveCommand(this.imageList, sha256);
    this.cm.executeCommand(cmd);
  }

  sortByName() {
    const cmd = new ImgArrangeSortCommand(this.imageList);
    this.cm.executeCommand(cmd);
  }

  split(index: number, dir: string) {
    const cmd = new ImgArrangeSplitCommand(this.imageList, index, dir);
    this.cm.executeCommand(cmd);
  }

  undo = () => this.cm.undo();
  redo = () => this.cm.redo();

  getImageBySha256(sha256: string): IChtnkMakeImage | undefined {
    return this.imageList().find(image => image.sha256 === sha256);
  }

  downloadZip() {
    const zip = new JSZip();

    const xml = this.comicInfo.generateComicInfoXml(this.comicInfo.comicInfoSignal());

    zip.file('ComicInfo.xml', xml);

    this.imageList().forEach((image, index) => {
      const paddedIndex = String(index + 1).padStart(Math.max(3, this.imageList.length), '0');
      const newName = `image_${paddedIndex}_${image.name}`;

      fetch(image.src)
        .then(res => res.blob())
        .then(blob => {
          zip.file(newName, blob);

          if (index === this.imageList().length - 1) {
            zip.generateAsync({ type: 'blob' }).then((content: any) => {
              const link = document.createElement('a');
              link.href = URL.createObjectURL(content);
              link.download = this.comicInfo.genFileName() + '.cbz';
              link.click();
            });
          }
        });
    });
  }

}
