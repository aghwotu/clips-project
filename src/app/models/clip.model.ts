import firebase from 'firebase/compat/app';

export default interface IClip {
  docID?: string;
  uid: string;
  displayName: string;
  clipTitle: string;
  fileName: string;
  url: string;
  screenshotURL: string;
  timestamp: firebase.firestore.FieldValue;
}
