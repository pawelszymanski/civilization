---
name: create-component
description: Generate a new Angular component in this project matching the team's conventions — CSS class selector, ViewEncapsulation.None, ChangeDetectionStrategy.OnPush, subscriptions pattern, OnInit/OnDestroy lifecycle hooks, and optional Web Worker boilerplate.
---

# create-component

Generates a new Angular component under `src/app/components/` and registers it in `app.module.ts`.

**Driver:** `.claude/skills/create-component/driver.mjs` (Node.js, run from project root)

## Conventions enforced

- Selector is a CSS class (`.my-widget-component`), not an element — matching all existing components
- `ViewEncapsulation.None` — styles intentionally bleed to children
- `ChangeDetectionStrategy.OnPush` by default
- Subscriptions managed via `subscriptions: Subscription[]` with push/forEach-unsubscribe pattern
- `OnInit`/`OnDestroy` lifecycle with `subscribeToData()` / `unsubscribeFromData()` helpers
- Workers use `new Worker(new URL(..., import.meta.url), {type: 'module'})`

## Run

From the project root (`C:\dev\civilization\`):

```
node .claude/skills/create-component/driver.mjs <path> [options]
```

| Argument | Description |
|---|---|
| `path` | Component path relative to `src/app/components/` |
| `--worker` | Add Web Worker boilerplate (`{type: 'module'}`) |
| `--simple` | Minimal — no `OnInit`/`OnDestroy` or subscriptions |
| `--no-push` | Omit `ChangeDetectionStrategy.OnPush` |
| `--group <name>` | Comment label added in `app.module.ts` COMPONENTS array |
| `--dry-run` | Preview generated content without writing files |

## Examples

```
# Standard component with subscriptions and OnPush
node .claude/skills/create-component/driver.mjs hud/my-widget --group hud

# Modal with worker
node .claude/skills/create-component/driver.mjs modals/my-modal --worker --group "gameplay modals"

# Minimal leaf component (no lifecycle)
node .claude/skills/create-component/driver.mjs sidebars/dev-tools/components/my-form --simple

# Preview without writing
node .claude/skills/create-component/driver.mjs hud/test-widget --dry-run
```

## Generated output

For `node driver.mjs hud/my-widget --group hud`:

**`my-widget.component.ts`**
```typescript
import {Component, ChangeDetectionStrategy, OnDestroy, OnInit, ViewEncapsulation} from '@angular/core';
import {Subscription} from 'rxjs';

@Component({
  selector: '.my-widget-component',
  templateUrl: './my-widget.component.html',
  styleUrls: ['./my-widget.component.scss'],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyWidgetComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];

  constructor() {}

  // INIT

  ngOnInit(): void {
    this.subscribeToData();
  }

  ngOnDestroy(): void {
    this.unsubscribeFromData();
  }

  subscribeToData(): void {
    this.subscriptions.push(
      // TODO
    );
  }

  unsubscribeFromData(): void {
    this.subscriptions.forEach(s => s.unsubscribe());
  }

}
```

**`my-widget.component.scss`** (SCSS `@import` depth computed from path depth)
```scss
@import '../../../../styles/mixins';
@import '../../../../styles/variables';

.my-widget-component {
}
```

**`my-widget.component.html`**
```html
<!-- MyWidgetComponent -->
```

**`app.module.ts` additions**
```
+ import {MyWidgetComponent} from './components/hud/my-widget/my-widget.component';
+   // hud
+   MyWidgetComponent,
```

## Gotchas

- Pass `hud/my-widget`, not `hud/my-widget-component` — the `Component` class-name suffix is added automatically.
- SCSS `@import` paths are computed from path depth, so they resolve correctly at any nesting level.
- `app.module.ts` import is inserted before `// DIRECTIVES`, and the class is appended at the end of the COMPONENTS array. Move it to the right comment group manually if needed.
- `--worker` adds the boilerplate assuming a worker file at `src/app/workers/<kebab-name>.worker.ts` — create that file separately.
