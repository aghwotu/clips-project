import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private _visible = false;

  constructor() {}

  isModalOpen(): boolean {
    return this._visible;
  }

  toggleModal() {
    this._visible = !this._visible;
  }
}
