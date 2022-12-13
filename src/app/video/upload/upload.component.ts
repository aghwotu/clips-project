import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { last, switchMap } from 'rxjs/operators';
import { AlertColor } from 'src/app/models/alert.model';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService, FfmpegService } from 'src/app/services';
import { Router } from '@angular/router';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent implements OnDestroy {
  isDragover: boolean = false;
  file: File | null = null;
  nextStep: boolean = false;
  screenshots: string[] = [];
  selectedScreenshot: string = '';
  screenshotTask?: AngularFireUploadTask;

  formInSubmission: boolean = false;
  showAlert: boolean = false;
  alertColor: string = AlertColor.Blue;
  alertMessage: string = 'Please wait. Your file is being uploaded';
  uploadPercentage: number = 0;
  showPercentage: boolean = false;

  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  videoTitle = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
  });
  videoUploadForm = new FormGroup({
    videoTitle: this.videoTitle,
  });

  constructor(
    private _storage: AngularFireStorage,
    private _auth: AngularFireAuth,
    private _clipsService: ClipService,
    private _router: Router,
    public ffmpegService: FfmpegService
  ) {
    _auth.user.subscribe((user) => (this.user = user));
    this.ffmpegService.init();
  }

  async storeFile($event: Event) {
    if (this.ffmpegService.isRunning === true) {
      return;
    }

    this.isDragover = false;

    this.file = ($event as DragEvent).dataTransfer
      ? ($event as DragEvent).dataTransfer?.files.item(0) ?? null
      : ($event.target as HTMLInputElement).files?.item(0) ?? null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.screenshots = await this.ffmpegService.getScreenshots(this.file);
    this.selectedScreenshot = this.screenshots[0];

    this.videoTitle.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.nextStep = true;
  }

  async uploadFile() {
    this.videoUploadForm.disable();

    this.showAlert = true;
    this.alertColor = AlertColor.Blue;
    this.alertMessage = 'Please wait. Your file is being uploaded';
    this.formInSubmission = true;
    this.showPercentage = true;

    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    const screenshotBlob = await this.ffmpegService.blobFromURL(
      this.selectedScreenshot
    );

    const screenshotPath = `screenshots/${clipFileName}.png`;
    this.screenshotTask = this._storage.upload(screenshotPath, screenshotBlob);

    this.task = this._storage.upload(clipPath, this.file);
    const clipReference = this._storage.ref(clipPath);

    combineLatest([
      this.task.percentageChanges(),
      this.screenshotTask.percentageChanges(),
    ]).subscribe((progress) => {
      const [clipProgress, screenshotProgress] = progress;

      if (!clipProgress || !screenshotProgress) {
        return;
      }
      const total = clipProgress + screenshotProgress;
      this.uploadPercentage = (total as number) / 200;
    });

    // alternative way to check the uploadPercentage of the upload
    // this.task.snapshotChanges().subscribe(console.log);

    // the `last()` operator will only emit the last value pushed from the Observable
    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipReference.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            clipTitle: this.videoTitle.value as string,
            fileName: `${clipFileName}.mp4`,
            url,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          };

          const clipDocumentReference = await this._clipsService.createClip(
            clip
          );

          this.alertColor = AlertColor.Green;
          this.alertMessage =
            'Success! Your clip is now ready to share with the world.';
          this.showPercentage = false;

          setTimeout(() => {
            this._router.navigate(['clip', clipDocumentReference.id]);
          }, 1000);
        },
        error: (error) => {
          this.videoUploadForm.enable();

          this.alertColor = AlertColor.Red;
          this.alertMessage = 'Upload failed! Please try again later.';
          this.formInSubmission = true;
          this.showPercentage = false;
          console.error(error);
        },
      });
  }

  ngOnDestroy(): void {
    // the `cancel()` method will cease the upload to firebase
    this.task?.cancel();
  }
}
