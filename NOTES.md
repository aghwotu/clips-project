- [ZTM Angular - Tutorial notes](#ztm-angular---tutorial-notes)
  - [Modules](#modules)
  - [Components](#components)
  - [Multi-slot Content Projection](#multi-slot-content-projection)
  - [Services](#services)
    - [Injecting Services](#injecting-services)
        - [Method 1](#method-1)
        - [Method 2:](#method-2)
        - [Method 3](#method-3)
  - [Singletons](#singletons)

# ZTM Angular - Tutorial notes

## Modules

The module system in Angular helps us to export and import a group of files. The modules we create should group files by feature.

The `CommonModule` exports components, directives and pipes.

## Components

We have different types of components:

- Single-use Components: our navigation is an example of a single-use component. We only have to create it once and reuse it.
- Reusable components: our modal is an example of a reusable component. At the moment, it will always render the same component.

Our goal is to create a reusable component.

## Multi-slot Content Projection

```html
<!-- shared/app-modal.component.html -->
<ng-content select="heading">
  <!-- project the heading here -->
</ng-content>

<!-- user/app-auth-modal.component.html -->
<app-modal>
  <p heading>Authentication title here</p>
</app-modal>
```

## Services

Services are objects that can be made available to any component of our app.
Dependency Injection is a programming practice for creating objects. It is not specific to Angular.

### Injecting Services

There are 3 ways of injecting a class into a component

##### Method 1

```javascript
// modal.service.ts
import {Injectable} from '@angular/core';

@Injectable({
  providedIin: 'root' //this will tell Angular where to expose the service
})
```

##### Method 2:

If we don't want to make our service/component globally injectable, we can place in a module. By registering a service in a module, it will be available to components, directives and pipes declared in the same module. Everywhere else will not have access to this service.

```javascript
// shared.module.ts
import { ModalService } from '../services/modal.service';

@NgModule({
  declarations: [],
  imports: [],
  exports: [],
  providers: [ModalService], // providers is an array of services
})
```

##### Method 3

We can register services with components:

```javascript
// modal.component.ts
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: '',
  templateUrl: '',
  styleUrls: [],
  providers: [ModalService],
})

export class ModalComponent implements OnInit {
  constructor(public modal: ModalService) {

  }
}
```

Finally, you can inject services on a:

1. global level,
1. module level or
1. component level

## Singletons

A singleton is when one instance of a class exists in an application
