import { Component, effect, inject, input, OnInit } from '@angular/core';
import { ComicInfoService } from '../data-access';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comic-info',
  templateUrl: './comic-info.component.html',
  styleUrl: './comic-info.component.scss'
})
export class ComicInfoComponent implements OnInit {
  disabled = input<boolean>(false)
  manga = input()
  comicInfoService = inject(ComicInfoService);

  comicInfoForm!: FormGroup;

  constructor(private fb: FormBuilder) {

  }
  ngOnInit(): void {
    this.init()
  }

  init() {
    const data = this.comicInfoService.comicInfoSignal()
    this.comicInfoForm = this.fb.group({
      general: this.fb.group({
        title: [data.general.title ?? ''],
        series: [data.general.series ?? ''],
        number: [data.general.number ?? ''],
        volume: [data.general.volume ?? ''],
        summary: [data.general.summary ?? ''],
       
      }),
      creators: this.fb.group({
        writer: [data.creators.writer ?? ''],
        penciller: [data.creators.penciller ?? ''],
        inker: [data.creators.inker ?? ''],
        colorist: [data.creators.colorist ?? ''],
        coverArtist: [data.creators.coverArtist ?? ''],
      }),
      publication: this.fb.group({
        publisher: [data.publication.publisher ?? ''],
        year: [data.publication.year ?? ''],
        month: [data.publication.month ?? ''],
        day: [data.publication.day ?? ''],
      }),
      technical: this.fb.group({
        pageCount: [data.technical.pageCount ?? ''],
        languageISO: [data.technical.languageISO ?? ''],
        manga: [{ value: this.manga(), disabled: true }],
      }),
      additional: this.fb.group({
        characters: [data.additional.characters ?? ''],
        teams: [data.additional.teams ?? ''],
        locations: [data.additional.locations ?? ''],
        storyArc: [data.additional.storyArc ?? ''],
        scanInformation: [data.additional.characters ?? ''],
      }),
    });

    this.comicInfoForm.valueChanges.subscribe(value => {
      this.comicInfoService.updateComicInfo(value);
    });
  }

}
