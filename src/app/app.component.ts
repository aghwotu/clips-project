import { Component } from '@angular/core';
import { AuthService } from './services/auth.service';
import { ModalService } from './services/modal.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'clips-project';

  constructor(public auth: AuthService) {}
}
