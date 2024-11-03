import { Injectable, signal, WritableSignal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  private _files: WritableSignal<FileList | null> = signal<FileList | null>(null);

  public set files(f: FileList) {
    this._files.set(f);
  }

  public get files(): WritableSignal<FileList | null> {
    return this._files;
  }

  reset() {
    this._files.set(null);
  }

}
