import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';

@Injectable({
  providedIn: 'root'
})
export class FileHashService {

  getSHA256(arrayBuffer: ArrayBuffer) {
    const wordArray = this.arrayBufferToWordArray(arrayBuffer);
    const md5Hash = CryptoJS.SHA256(wordArray).toString();
    return md5Hash;
  }

  public getMd5Hash(arrayBuffer: ArrayBuffer) {
    const wordArray = this.arrayBufferToWordArray(arrayBuffer);
    const md5Hash = CryptoJS.MD5(wordArray).toString();
    return md5Hash;
  }

  private arrayBufferToWordArray(arrayBuffer: ArrayBuffer): CryptoJS.lib.WordArray {
    const uint8Array = new Uint8Array(arrayBuffer);
    const words: any[] = [];
    for (let i = 0; i < uint8Array.length; i++) {
      words[i >>> 2] |= uint8Array[i] << (24 - (i % 4) * 8);
    }
    return CryptoJS.lib.WordArray.create(words, uint8Array.length);
  }
}
