import { Component } from '@angular/core';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss'],
})
export class UploadComponent {
  isDragover: boolean = false;

  storeFile(event: Event) {
    this.isDragover = false;
  }
}
