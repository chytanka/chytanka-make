import { Component, HostListener, inject, OnInit } from '@angular/core';
import { FileService } from '../data-access/file.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-file-change',
  templateUrl: './file-change.component.html',
  styleUrl: './file-change.component.scss'
})
export class FileChangeComponent implements OnInit {
  ngOnInit(): void {
    this.initFileInput();

    if ("launchQueue" in window) {
      (window as any).launchQueue.setConsumer(async (launchParams: FileSystemFileHandle) => {

        const file: File = await launchParams.getFile();
        this.fileHandler([file] as unknown as FileList)
      });
    }
  }

  // should be input
  accept = ['image/*']

  fs = inject(FileService)
  router = inject(Router)

  onFileSelected(event: any) {
    const files: FileList = event.target.files;

    this.fileHandler(files)
  }

  fileHandler(files: FileList | undefined) {
    if (!files) return;

    this.fs.files = files;

    // HERE
  }

  getRouteType(file: File): string | undefined {
    const fileType = file.type || file.name.split('.').pop()?.toLowerCase();

    if (!fileType) return undefined;

    if (/jpg|png|jpeg|webp/.test(fileType)) return 'zip';

    return undefined;
  }

  input = document.createElement('input')

  initFileInput() {
    this.input = document.createElement('input')

    this.input.type = 'file';
    this.input.multiple = true
    this.input.accept = this.accept.join(', ');

    this.input.oninput = (e: Event) => {
      this.onFileSelected(e)
    }

  }

  openFileDialog() {

    this.input.click();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {

    const code = event.ctrlKey ? `Ctrl+${event.code}` : event.code

    if (code == "Ctrl+KeyO") {
      event.preventDefault();

      this.openFileDialog()
    }
  }

  @HostListener('document:dragover', ["$event"])
  dragOverHandler = (ev: DragEvent) => { ev.preventDefault(); this.showDragAndDropZone = true }

  @HostListener('dragleave', ["$event"])
  @HostListener('dragend', ["$event"])
  dragLeaveHandler = (ev: DragEvent) => { ev.preventDefault(); this.showDragAndDropZone = false }

  dropHandler(ev: DragEvent) {
    ev.preventDefault();

    const files: FileList | undefined = ev.dataTransfer?.files;

    this.fileHandler(files)
  }

  showDragAndDropZone: boolean = false;
}
