import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ModalService } from 'src/app/services';
import IClip from 'src/app/models/clip.model';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  modalID: string = 'editClip';
  @Input() activeClip: IClip | null = null;
  constructor(private _modalService: ModalService) {}

  ngOnInit(): void {
    this._modalService.register(this.modalID);
  }

  ngOnDestroy(): void {
    this._modalService.unregister(this.modalID);
  }
}
