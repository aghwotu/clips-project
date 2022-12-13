import { Component, OnInit, OnDestroy } from '@angular/core';
import { ClipService } from '../services';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.scss'],
})
export class ClipsListComponent implements OnInit, OnDestroy {
  constructor(public clipService: ClipService) {
    this.clipService.getClips();
  }

  ngOnInit(): void {
    window.addEventListener('scroll', this.handleScroll);
  }

  handleScroll = () => {
    const { scrollTop, offsetHeight } = document.documentElement;
    const { innerHeight } = window;

    const bottomOfWindow = Math.round(scrollTop) + innerHeight === offsetHeight;

    if (bottomOfWindow) {
      this.clipService.getClips();
      console.log('we are at the bottom of the window');
    }
  };

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.handleScroll);
  }
}
