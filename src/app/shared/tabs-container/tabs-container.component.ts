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

  ngAfterContentInit(): void {
    const activeTabs = this.tabs?.filter((tab) => tab.active === true);
    if (!activeTabs || activeTabs.length === 0) {
      this.selectTab(this.tabs!.first);
    }
  }

  selectTab(tab: TabComponent) {
    this.tabs?.forEach((tab) => (tab.active = false));
    tab.active = true;
  }

  tabStatusClass(tab: TabComponent): string {
    return tab.active
      ? 'bg-indigo-400 text-white hover:text-white'
      : 'hover:text-indigo-400';
  }
}
