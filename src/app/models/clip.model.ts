import firebase from 'firebase/compat/app';

export default interface IClip {
  uid: string;
  displayName: string;
  clipTitle: string;
  fileName: string;
  url: string;
  timestamp: firebase.firestore.FieldValue;
}
