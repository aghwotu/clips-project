import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { ClipService, ModalService } from 'src/app/services';
import IClip from 'src/app/models/clip.model';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1'; //we are storing this as a string because it is the default type from input fields
  clips: IClip[] = [];
  activeClip: IClip | null = null;
  sort$: BehaviorSubject<string>;

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _clipService: ClipService,
    private _modalService: ModalService
  ) {
    this.sort$ = new BehaviorSubject(this.videoOrder);
  }

  ngOnInit() {
    this._route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder =
        params['params']['sort'] === '2' ? params['params']['sort'] : '1';
      this.sort$.next(this.videoOrder);
    });

    this._clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.clips = []; //reset array

      docs.forEach((doc) => {
        this.clips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    // option 1
    // this._router.navigateByUrl(`/manage?sort=${value}`);

    // option 2
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(event: Event, clip: IClip) {
    event.preventDefault();
    this.activeClip = clip;
    this._modalService.toggleModal('editClip');
  }

  update($event: IClip) {
    this.clips.forEach((element, index) => {
      if (element.docID === $event.docID) {
        this.clips[index].clipTitle = $event.clipTitle;
      }
    });
  }

  deleteClip($event: Event, clip: IClip) {
    $event.preventDefault();

    this._clipService.deleteClip(clip);

    this.clips.forEach((element, index) => {
      if (element.docID == clip.docID) {
        this.clips.splice(index, 1);
      }
    });
  }

  async copyToClipboard(event: MouseEvent, documentID: string | undefined) {
    event.preventDefault();

    if (!documentID) {
      return;
    }

    const url = `${location.origin}/clip/${documentID}`;
    await navigator.clipboard.writeText(url);
    alert('Link Copied!');
  }
}
