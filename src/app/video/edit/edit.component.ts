import { Component, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from 'src/app/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy {
  modalID: string = 'editClip';
  constructor(private _modalService: ModalService) {}

  ngOnInit(): void {
    this._modalService.register(this.modalID);
  }

  ngOnDestroy(): void {
    this._modalService.unregister(this.modalID);
  }
}
