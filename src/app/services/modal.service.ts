import { Injectable } from '@angular/core';

interface IModal {
  modalID: string;
  isVisible: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class ModalService {
  // we'll push new modals into this array
  private modals: IModal[] = [];

  constructor() {}

  // In order to ensure that only one modal is always displayed we will 'register' them with unique ids
  register(modalID: string) {
    this.modals.push({
      modalID,
      isVisible: false,
    });
  }

  unregister(modalID: string) {
    this.modals = this.modals.filter((modal) => modal.modalID !== modalID);
  }

  isModalOpen(modalID: string): boolean {
    return !!this.modals.find((element) => element.modalID === modalID)
      ?.isVisible;
    // OR
    // return Boolean(
    //   this.modals.find((element) => element.modalID === modalID)?.isVisible
    // );
  }
  // OR
  // isModalOpen(modalID: string): boolean | undefined {
  //   return this.modals.find((element) => element.modalID === modalID)?.isVisible;
  // }

  toggleModal(modalID: string) {
    const modal = this.modals.find((element) => element.modalID === modalID);

    if (modal) {
      modal.isVisible = !modal.isVisible;
    }
  }
}
