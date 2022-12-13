import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ViewEncapsulation,
} from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import videojs from 'video.js';
import IClip from '../models/clip.model';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-clip',
  templateUrl: './clip.component.html',
  styleUrls: ['./clip.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [DatePipe],
})
export class ClipComponent implements OnInit {
  @ViewChild('videoPlayer', { static: true }) target?: ElementRef;
  videoPlayer?: videojs.Player;
  clip?: IClip;

  constructor(public route: ActivatedRoute) {}

  ngOnInit() {
    this.videoPlayer = videojs(this.target?.nativeElement);

    // resolve data is stored in the 'data' property
    this.route.data.subscribe((data) => {
      this.clip = data['clip'] as IClip;

      this.videoPlayer?.src({ src: this.clip.url, type: 'video/mp4' });
    });
  }
}
