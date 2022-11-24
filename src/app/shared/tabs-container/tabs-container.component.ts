import {
  Component,
  ContentChildren,
  AfterContentInit,
  QueryList,
} from '@angular/core';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-tabs-container',
  templateUrl: './tabs-container.component.html',
  styleUrls: ['./tabs-container.component.scss'],
})
export class TabsContainerComponent implements AfterContentInit {
  // this selects projected content
  @ContentChildren(TabComponent) tabs?: QueryList<TabComponent>;

  constructor() {}

  ngAfterContentInit() {
    console.log(this.tabs?.length);

    console.log(this.tabs);
  }
}
