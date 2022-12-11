import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { ModalService } from 'src/app/services';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  modalID: string = 'editClip';
  @Input() activeClip: IClip | null = null;

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });
  formInSubmission: boolean = false;
  constructor(private _modalService: ModalService) {}

  ngOnInit(): void {
    this._modalService.register(this.modalID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.clipID.setValue(this.activeClip.docID!);
    this.title.setValue(this.activeClip.clipTitle);
  }

  submitForm() {}

  ngOnDestroy(): void {
    this._modalService.unregister(this.modalID);
  }
}
