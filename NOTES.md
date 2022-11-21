# ZTM Angular - Tutorial notes

## Modules

The module system in Angular helps us to export and import a group of files. The modules we create should group files by feature.

The `CommonModule` exports components, directives and pipes.

## Components

We have different types of components:

- Single-use Components: or navigation is an example of a single-use component. We only have to create it once and reuse it.
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
