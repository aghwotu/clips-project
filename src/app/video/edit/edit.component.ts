import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services';
import IClip from 'src/app/models/clip.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AlertColor } from 'src/app/models/alert.model';
import { ClipService } from 'src/app/services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  modalID: string = 'editClip';
  @Input() activeClip: IClip | null = null;
  @Output() update = new EventEmitter();

  alertColor: string = AlertColor.Blue;
  alertMessage: string = '';
  showAlert: boolean = false;
  formInSubmission: boolean = false;

  clipID = new FormControl('');
  title = new FormControl('', [Validators.required, Validators.minLength(3)]);
  editForm = new FormGroup({
    title: this.title,
    id: this.clipID,
  });

  constructor(
    private _modalService: ModalService,
    private _clipService: ClipService
  ) {}

  ngOnInit(): void {
    this._modalService.register(this.modalID);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.activeClip) {
      return;
    }

    this.formInSubmission = false;
    this.showAlert = false;
    this.clipID.setValue(this.activeClip.docID!);
    this.title.setValue(this.activeClip.clipTitle);
  }

  async submit() {
    if (!this.activeClip) {
      return;
    }

    this.showAlert = true;
    this.formInSubmission = true;
    this.alertColor = AlertColor.Blue;
    this.alertMessage = 'Please wait! Updating clip.';

    try {
      await this._clipService.updateClip(
        this.clipID.value as string,
        this.title.value as string
      );
    } catch (e) {
      this.formInSubmission = false;
      this.alertColor = AlertColor.Red;
      this.alertMessage = 'Something went wrong. Please try again later.';
      return;
    }

    this.activeClip.clipTitle = this.title.value as string;
    this.update.emit(this.activeClip);

    this.formInSubmission = false;
    this.alertColor = AlertColor.Green;
    this.alertMessage = 'Success!';
  }

  ngOnDestroy(): void {
    this._modalService.unregister(this.modalID);
  }
}
