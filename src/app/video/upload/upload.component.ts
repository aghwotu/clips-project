import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last } from 'rxjs/operators';
import { AlertColor } from 'src/app/models/alert.model';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;

  formInSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor: string = AlertColor.Blue;
  alertMessage: string = 'Please wait. Your file is being uploaded';
  uploadPercentage: number = 0;
  showPercentage: boolean = false;

  videoTitle = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  videoUploadForm = new FormGroup({
    videoTitle: this.videoTitle,
  });

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
    this.showAlert = true;
    this.alertColor = AlertColor.Blue;
    this.alertMessage = 'Please wait. Your file is being uploaded';
    this.formInSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const task = this._storage.upload(clipPath, this.file);
    task.percentageChanges().subscribe((progress) => {
      this.uploadPercentage = (progress as number) / 100;
    });

    // alternative way to check the uploadPercentage of the upload
    // task.snapshotChanges().subscribe(console.log);

    // the `last()` operator will only emit the last value pushed from the Observable
    task
      .snapshotChanges()
      .pipe(last())
      .subscribe({
        next: (snapshot) => {
          this.alertColor = AlertColor.Green;
          this.alertMessage =
            'Success! Your clip is now ready to share with the world.';
          this.showPercentage = false;
        },
        error: (error) => {
          this.alertColor = AlertColor.Red;
          this.alertMessage = 'Upload failed! Please try again later.';
          this.formInSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }
}
