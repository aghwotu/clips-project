import { Component, OnDestroy, OnInit } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.scss'],
})
export class AuthModalComponent implements OnInit, OnDestroy {
  modalName = 'auth';
  constructor(public modal: ModalService) {}

  ngOnInit(): void {
    this.modal.register(this.modalName);
  }

  ngOnDestroy(): void {
    this.modal.unregister(this.modalName);
  }
}
