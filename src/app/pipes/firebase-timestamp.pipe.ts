import { Pipe, PipeTransform } from '@angular/core';
import firebase from 'firebase/compat/app';
import { DatePipe } from '@angular/common';

@Pipe({
  name: 'firebaseTimestamp',
})
export class FirebaseTimestampPipe implements PipeTransform {
  constructor(private _datePipe: DatePipe) {}

  transform(value: firebase.firestore.FieldValue) {
    const date = (value as firebase.firestore.Timestamp).toDate();
    return this._datePipe.transform(date, 'mediumDate');
  }
}
