import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  videoTitle = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  videoUploadForm = new FormGroup({
    videoTitle: this.videoTitle,
  });
  formInSubmission: boolean = false;

  constructor(private _storage: AngularFireStorage) {}

  storeFile($event: Event) {
    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer?.files.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.videoTitle.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  uploadFile() {
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this._storage.upload(clipPath, this.file);
  }
}
