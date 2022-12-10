import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.scss'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1'; //we are storing this as a string because it is the default type from input fields

  constructor(private _router: Router, private _route: ActivatedRoute) {}

  ngOnInit() {
    this._route.queryParamMap.subscribe((params: Params) => {
      this.videoOrder =
        params['params']['sort'] === '2' ? params['params']['sort'] : '1';
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    // option 1
    // this._router.navigateByUrl(`/manage?sort=${value}`);

    // option 2
    this._router.navigate([], {
      relativeTo: this._route,
      queryParams: {
        sort: value,
      },
    });
  }
}
