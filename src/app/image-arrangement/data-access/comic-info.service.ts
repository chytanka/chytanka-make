import { computed, effect, Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { ComicInfo } from '../model/comic-info';
import { isPlatformBrowser } from '@angular/common';
import { slugify } from 'transliteration';

@Injectable({
  providedIn: 'root'
})
export class ComicInfoService {

  private readonly storageKey = 'comicInfo';
  comicInfoSignal = signal<ComicInfo>(this.loadFromSessionStorage());



  constructor(@Inject(PLATFORM_ID) private platformId: object) {
    if (isPlatformBrowser(this.platformId)) {
      effect(() => {
        this.saveToSessionStorage(this.comicInfoSignal());
      })
    }
  }

  getComicInfo() {
    return this.comicInfoSignal.asReadonly();
  }

  updateComicInfo(comicInfo: Partial<ComicInfo>) {
    this.comicInfoSignal.update(info => ({ ...info, ...comicInfo }));
  }

  private saveToSessionStorage(comicInfo: ComicInfo) {
    sessionStorage.setItem(this.storageKey, JSON.stringify(comicInfo));
  }

  private loadFromSessionStorage(): ComicInfo {

    const data = (isPlatformBrowser(this.platformId)) ? sessionStorage.getItem(this.storageKey) : undefined;
    return data
      ? JSON.parse(data)
      : {
        general: {
          title: "",
          series: "",
          number: "",
          volume: ""
        },
        creators: {
          writer: "",
          penciller: "",
          inker: "",
          colorist: "",
          coverArtist: ""
        },
        publication: {
          publisher: "",
          year: "",
          month: "",
          day: ""
        },
        technical: {
          pageCount: "",
          languageISO: ""
        },
        additional: {
          characters: "",
          teams: "",
          locations: "",
          storyArc: "",
          scanInformation: ""
        }
      };
  }

  // comicInfoXml = computed(() => `
  // <ComicInfo>
  //   <Title>${this.title()}</Title>
  //   <Author>${this.author()}</Author>
  //   <Publisher>${this.publisher()}</Publisher>
  //   <Language>${this.language()}</Language>
  // </ComicInfo>`);


  generateComicInfoXml(comicInfo: ComicInfo): string {
    const doc = document.implementation.createDocument('', '', null);
    const comicInfoElement = doc.createElement('ComicInfo');

    Object.values(comicInfo).forEach(groupFields => {
      Object.entries(groupFields).forEach(([fieldName, value]) => {
        this.addTextElement(doc, comicInfoElement, this.capitalize(fieldName), `${value}`);
      });
    });

    doc.appendChild(comicInfoElement);

    const serializer = new XMLSerializer();
    const xmlString = serializer.serializeToString(doc);

    return `<?xml version='1.0' encoding='utf-8'?>\n${xmlString}`;
  }

  private addTextElement(doc: Document, parent: Element, name: string, value: string) {
    const element = doc.createElement(name);
    element.textContent = value;
    parent.appendChild(element);
  }

  private capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  genFileName(): any {
    const title = this.comicInfoSignal().general.title;
    const str = title !== "" ? title : "chytanka";

    return slugify(str);
  }

}


/**
 * TODO
 */

// Letterer
// Editor
// Notes

// Web

// Pages
//     <Page Image="0" ImageHeight="1280" ImageSize="195977" ImageWidth="800" Type="FrontCover" />