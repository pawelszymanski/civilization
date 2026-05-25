# Code Style Guide

---

## Overall Code Style

### Formatting
- **Indentation:** 2 spaces, no tabs
- **Quotes:** Single quotes everywhere (TypeScript and HTML attributes)
- **Semicolons:** Always required
- **Trailing commas:** Present in multi-line arrays and objects
- **Line length:** No hard limit; aim for ~100 characters, wrap naturally at logical points
- **Blank lines:** One blank line between class methods; blank lines between import groups

### Naming Conventions
| Thing | Convention | Example |
|---|---|---|
| Files | `kebab-case.type.ts` | `camera.store.ts`, `tile-ui.service.ts` |
| Classes / Interfaces / Types | `PascalCase` | `CameraStore`, `TileUiService` |
| Enums | `PascalCase` (name), `SCREAMING_SNAKE_CASE` (members) | `TerrainBaseId.GRASSLAND_FLAT` |
| Constants (primitive) | `SCREAMING_SNAKE_CASE` | `CAMERA_MIN_ZOOM_LEVEL` |
| Constants (object/default) | `SCREAMING_SNAKE_CASE` | `DEFAULT_CAMERA`, `CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP` |
| Properties / methods | `camelCase` | `tileSize`, `updateTilesUiData()` |
| Private BehaviorSubjects | `_camelCase` | `_camera` |
| Event handlers | `on` prefix | `onMousedown`, `onSaveGameClick` |
| Initializers | `init` prefix | `initContext`, `initMinimapCtx` |

### TypeScript
- **Access modifiers:** `private` on internal members; `public` omitted (implicit); `readonly` on exposed observables and true constants
- **Return types:** Always annotated on methods
- **Parameter types:** Always annotated
- **Null checks:** Defensive double-bang: `!!this.camera && !!this.map`; optional properties use `?`; no optional chaining (`?.`) or nullish coalescing (`??`)
- **Spread for immutability:** `{ ...this._store.value, field: newValue }` — always used in store mutations
- **`const` in for-of:** `for (const tile of map.tiles)` — always `const`, never `let`
- **Constructors:** Always written across multiple lines — each parameter on its own line — even when there is only one parameter. Example:
  ```typescript
  constructor(
    private tileYieldService: TileYieldService,
  ) {}
  ```

### Import Ordering
Imports are grouped in this strict order, with one blank line between groups:

```typescript
// 1. Angular core / common / platform
import {Component, OnInit, NgZone} from '@angular/core';
import {DOCUMENT} from '@angular/common';

// 2. RxJS
import {Subscription, BehaviorSubject, Observable} from 'rxjs';

// 3. Models
import {Camera} from '../../models/camera';
import {Map} from '../../models/map';

// 4. Constants
import {DEFAULT_CAMERA} from '../../consts/camera.const';

// 5. Services
import {CameraService} from '../../services/camera.service';

// 6. Stores
import {CameraStore} from '../../stores/camera.store';

// 7. Pipes (when injected)
import {TileCssClassesPipe} from '../../pipes/tile-css-classes.pipe';
```

---

## File and Folder Organization

### Structure
```
src/app/
├── components/
│   ├── app/
│   ├── hud/
│   │   ├── mini-map/
│   │   ├── quick-links/
│   │   ├── screen-center-marker/
│   │   └── status-bar/
│   ├── main-menu/
│   ├── map/
│   ├── modals/
│   │   ├── menus/
│   │   │   ├── exit-game-confirmation/
│   │   │   ├── game-options-menu/
│   │   │   └── in-game-menu/
│   │   ├── research/
│   │   │   ├── civic-tree/
│   │   │   └── technology-tree/
│   │   └── save-and-load/
│   │       ├── load-game/
│   │       ├── save-details/
│   │       └── save-game/
│   └── sidebars/
│       ├── dev-tools/
│       │   └── components/
│       │       ├── camera-form/
│       │       ├── generate-map-form/
│       │       └── performance-chart/
│       └── world-builder/
├── consts/
├── models/
├── pipes/
├── services/
├── stores/
├── workers/
└── app.module.ts

src/styles/
├── functions/
│   └── str-replace.scss
├── mixins/
│   ├── generic/
│   │   ├── clearfix.scss
│   │   ├── disable-selection.scss
│   │   ├── font.scss
│   │   ├── position.scss
│   │   ├── position-block.scss
│   │   └── size.scss
│   └── specific/
│       ├── fade-in-out-based-on-active-class.scss
│       ├── in-game-menu-button.scss
│       └── sits-on-overlay.scss
├── functions.scss   (re-exports via @forward)
├── mixins.scss      (re-exports via @forward)
├── reset.scss
└── variables.scss
```

---

## Angular

### NgModule
Single root `AppModule` — no feature modules. Imports are organized using named constant arrays before the decorator:

```typescript
// COMPONENTS
import {AppComponent} from './components/app/app.component';
// ...

// SERVICES
import {CameraService} from './services/camera.service';
// ...

const COMPONENTS = [AppComponent, MapComponent, ...];
const DIRECTIVES = [];
const SERVICES = [CameraService, SizeService, ...];
const STORES = [CameraStore, UiStore, ...];
const PIPES = [TerrainBaseNamePipe, TileCssClassesPipe, ...];

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES, ...PIPES],
  imports: [BrowserModule, FormsModule, ReactiveFormsModule],
  providers: [
    { provide: Window, useValue: window },
    ...SERVICES,
    ...STORES,
    ...PIPES,   // Pipes also in providers so they can be injected as services
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
```

---

## Components

### File naming
`kebab-case.component.ts` + `.html` + `.scss` — always all three files.

### Decorator
```typescript
@Component({
  standalone: false,                        // always false (module-based)
  selector: '.component-name-component',    // CSS class selector (dot prefix)
  templateUrl: './component-name.component.html',
  styleUrls: ['./component-name.component.scss'],
  encapsulation: ViewEncapsulation.None,    // default choice; allows global styles
  changeDetection: ChangeDetectionStrategy.OnPush  // only when needed
})
```

Key points:
- Selector uses **dot notation** (CSS class, not element): `'.save-game-component'`
- Parent templates instantiate components as `<div class="component-name-component"></div>`
- `ViewEncapsulation.None` is the default choice — gives full control over styling
- `OnPush` is used only for performance-critical components with explicit `cdr.detectChanges()`

### Class anatomy and method order
```typescript
export class ExampleComponent implements OnInit, OnDestroy {

  // 1. Enum/const aliases exposed to template
  ModalId = ModalId;
  SidebarId = SidebarId;

  // 2. @ViewChild / @HostBinding decorators
  @ViewChild('canvas', { static: true }) canvas: ElementRef<HTMLCanvasElement>;

  // 3. Data properties (typed, no initializer unless a default is needed)
  ui: Ui;
  camera: Camera;
  saveName = '';

  // 4. Subscriptions array
  subscriptions: Subscription[] = [];

  constructor(
    private store: SomeStore,
    private service: SomeService,
  ) {}

  // INIT

  ngOnInit(): void { ... }

  ngOnDestroy(): void { ... }

  initSomething(): void { ... }        // init* prefix

  subscribeToData(): void { ... }

  unsubscribeFromData(): void { ... }

  // EVENTS

  onMousedown(event: MouseEvent): void { ... }   // on* prefix

  onClick(): void { ... }

  // OTHER

  helperMethod(): void { ... }

}
```

- Section comments (`// INIT`, `// EVENTS`, `// OTHER`) separate logical groups
- `subscribeToData()` / `unsubscribeFromData()` are always paired named methods, not inlined in lifecycle hooks

---

## Templates

### Component instantiation
Components are placed as `<div class="component-name-component"></div>` (class selector pattern):

```html
<div class="map-component"></div>
<div class="status-bar-component" *ngIf="ui.sidebar !== SidebarId.WORLD_BUILDER"></div>
```

### Structural directives
- `*ngIf` for conditional rendering; `ng-container` when no wrapper element is wanted
- `*ngFor` uses `let`: `*ngFor="let item of items"`

```html
<ng-container *ngIf="ui.screen === ScreenId.GAMEPLAY">
  <div class="map-component"></div>
</ng-container>
```

### Class bindings
Modifier classes use `m-` prefix. Prefer `[class.m-state]` over `[ngClass]` for simple boolean flags:

```html
<p [class.m-ok]="usedStoragePc < 75"
   [class.m-warning]="usedStoragePc >= 75 && usedStoragePc < 100"
   [class.m-error]="usedStoragePc >= 100">
```

`[ngClass]` used when returning an array or object from a pipe:
```html
[ngClass]="tile.isVisible ? (tile | tileCssClasses:camera.tileSize) : ''"
```

### Style bindings
Inline dynamic values use `[style.*]`:
```html
[style.display]="tile.isVisible ? 'block' : 'none'"
[style.transform]="tile.isVisible ? tile.transformStr : null"
```

### Modal / overlay visibility
Large modal panels remain in the DOM and are toggled via `.active` class, avoiding re-creation cost:
```html
<div class="civic-tree-component" [class.active]="ui.modal === ModalId.CIVIC_TREE"></div>
```

Smaller modals that are cheap to re-create use `*ngIf`:
```html
<div class="in-game-menu-component" *ngIf="ui.modal === ModalId.IN_GAME_MENU"></div>
```

### Event bindings
Always call named methods — no inline logic:
```html
(click)="onSaveGameClick()"
(mousedown)="onMousedown($event)"
(wheel)="onWheel($event)"
```

---

## Services

### File naming
`kebab-case.service.ts`

### Structure
```typescript
@Injectable({providedIn: 'root'})
export class ExampleService {

  someData: Type;

  constructor(
    private store: SomeStore,
    private otherService: OtherService,
  ) {
    this.subscribeToData();
  }

  private subscribeToData(): void {
    this.store.observable.subscribe(data => this.data = data);
  }

  public publicMethod(arg: Type): ReturnType {
    // ...
  }

  private privateHelper(): void { ... }
}
```

- `@Injectable({providedIn: 'root'})` — all services are root singletons
- Services subscribe to stores directly in constructor; no unsubscription needed (app-lifetime)
- Services perform calculations, coordinate between stores, wrap browser APIs

---

## Stores

Custom BehaviorSubject-based state management — no NgRx.

### File naming
`kebab-case.store.ts`

### Structure
```typescript
@Injectable()   // NOT providedIn: 'root' — provided in AppModule's providers array
export class ExampleStore {

  // tslint:disable-next-line:variable-name
  private _example: BehaviorSubject<Example> = new BehaviorSubject(DEFAULT_EXAMPLE);

  public readonly example: Observable<Example> = this._example.asObservable();

  constructor(private someService: SomeService) {}

  public next(value: Example): void {
    this._example.next(value);
  }

  public setSomeField(value: Type): void {
    this.next({ ...this._example.value, field: value });
  }

  public toggle(id: EnumId): void {
    const newId = this._example.value.id === id ? EnumId.NONE : id;
    this.next({ ...this._example.value, id: newId });
  }

  public resetAll(): void {
    this.next({ ...DEFAULT_EXAMPLE });
  }
}
```

Key rules:
- Private `BehaviorSubject` with underscore prefix (`_storeName`) — suppress tslint warning with comment
- Public `Observable` via `.asObservable()`, marked `readonly`
- Always use spread for mutations: `{ ...this._store.value, field: newValue }`
- Generic `next()` method for direct replacement
- Named setters for domain-specific mutations (`setTileSize`, `setTranslate`)
- Toggle methods for UI state (`toggle(id)` returns to NONE when toggling off)

---

## Models

### File naming
`kebab-case.ts` — one file per domain concept, grouped by topic.

### Patterns

**Numeric enums (default):**
```typescript
export enum TerrainBaseId {
  GRASSLAND_FLAT,
  GRASSLAND_HILLS,
  PLAINS_FLAT,
  // ...
}
```

**String enums (when value matters, e.g. yield):**
```typescript
export enum YieldId {
  FOOD = 'FOOD',
  PRODUCTION = 'PRODUCTION',
}
```

**Interfaces — no `I` prefix:**
```typescript
export interface Camera {
  zoomLevel: number;
  tileSize: number;
  translate: Coords;
}

export interface Tile {
  grid: Coords;
  terrain: Terrain;
  isVisible?: boolean;   // optional fields use ?
  px?: Coords;
}
```

**Type aliases (mapped types, branded primitives):**
```typescript
export type Yield = { [key in YieldId]: number };
export type Uuid = string;
export type Timestamp = string;
```

**Intersection types for composed sizes:**
```typescript
export interface Size {
  tile: FullSize & HalfSize & QuarterSize;
  screen: FullSize & HalfSize;
}
```

---

## Constants

### File naming
`kebab-case.const.ts`

### Naming patterns
| Type | Convention | Example |
|---|---|---|
| Scalar | `SCREAMING_SNAKE_CASE` | `CAMERA_MIN_ZOOM_LEVEL = -5` |
| Object/default | `SCREAMING_SNAKE_CASE` | `DEFAULT_CAMERA`, `TERRAIN_BASE_TO_COLOR_MAP` |
| Lookup map | `*_MAP` suffix | `CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP` |
| Metadata set | `*_SET` suffix | `TERRAIN_BASE_SET` |
| Array/list | `*_LIST` suffix | (rare, lists are in SCSS variables) |

### Structure
```typescript
import {Camera} from '../models/camera';

export const CAMERA_MIN_ZOOM_LEVEL = -5;
export const CAMERA_MAX_ZOOM_LEVEL = 5;
export const CAMERA_DEFAULT_ZOOM_LEVEL = -2;

export const CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP: { [key: number]: number } = {
  [-5]: 60,
  [-4]: 80,
  // ...
};

export const DEFAULT_CAMERA: Camera = {
  zoomLevel: CAMERA_DEFAULT_ZOOM_LEVEL,
  tileSize: CAMERA_ZOOM_LEVEL_TO_TILE_SIZE_MAP[CAMERA_DEFAULT_ZOOM_LEVEL],
  translate: { x: 0, y: 0 },
};
```

---

## Pipes

### File naming
`kebab-case.pipe.ts`

### Structure
```typescript
import {Pipe, PipeTransform} from '@angular/core';

@Pipe({standalone: false, name: 'pipeName'})
export class PipeNamePipe implements PipeTransform {

  transform(value: InputType, optionalArg?: ArgType): OutputType {
    return result;
  }

}
```

- `standalone: false` always
- Pipe name is `camelCase` in the decorator, used as `{{ value | pipeName:arg }}` in templates
- Pipes are pure (no side effects)
- Pipes are added to both `declarations` and `providers` in AppModule so they can be injected as services too
- Simple string transforms use enum reverse-lookup: `EnumName[enumValue].toLowerCase().replace(/_/gi, ' ')`

---

## RxJS

### Subscription management in components
```typescript
subscriptions: Subscription[] = [];

subscribeToData(): void {
  this.subscriptions.push(
    this.cameraStore.camera.subscribe(camera => this.camera = camera),
    this.mapStore.map.subscribe(map => this.map = map),
  );
}

unsubscribeFromData(): void {
  this.subscriptions.forEach(s => s.unsubscribe());
}
```

- All subscriptions collected in a `subscriptions: Subscription[]` array
- Pushed together in a single `subscribeToData()` call
- Cleaned up in `ngOnDestroy` via `unsubscribeFromData()`
- No `takeUntil`, no `async` pipe — explicit subscribe/unsubscribe pattern only

### Stores
- `BehaviorSubject` exclusively for state — never plain `Subject`
- Exposed as `Observable` via `.asObservable()` to prevent external `.next()` calls
- No pipe operators on store observables except where performance requires it (e.g. `distinctUntilChanged`)

### Callbacks
- Simple assignment: `camera => this.camera = camera`
- Named method for complex logic: `camera => this.onCameraUpdate(camera)`

---

## Forms

Template-driven forms only (`FormsModule`, not reactive). Keep forms minimal:

```html
<form class="save-options" novalidate>
  <input type="text" name="saveName" [(ngModel)]="saveName">
</form>
```

- `novalidate` on `<form>` to disable browser validation
- `[(ngModel)]` for two-way binding
- Validation logic in component methods, not form validators

---

## SCSS

### Per-component files
```scss
@use '../../../styles/mixins' as *;    // always first
@use '../../../styles/variables' as *;  // always second

.component-name-component {
  @include position-block(absolute, 0, 0, 0, 0, $z-index-modal);

  .child-element {
    display: flex;

    &.m-active { background: #9f9787; }
    &.m-disabled { opacity: .5; cursor: not-allowed; }
  }
}
```

### Conventions
- No BEM — flat nesting under component class
- **Modifier prefix:** `m-` for all state/variant classes (`m-active`, `m-ok`, `m-warning`, `m-error`, `m-disabled`, `m-odd`)
- `@use '...' as *` with wildcard namespace so variables/mixins are used without prefix
- Division always via `math.div()`: `math.div($button-height, 2)` (never `/`)
- `@use 'sass:math'` imported explicitly in files that use `math.div()`

### Shared SCSS
Aggregator files re-export with `@forward` so consumers use a single import:

```scss
// src/styles/mixins.scss
@forward 'mixins/generic/clearfix';
@forward 'mixins/generic/font';
@forward 'mixins/specific/in-game-menu-button';
```

Each mixin file declares its own dependencies explicitly with `@use`.

### Variables
All in `src/styles/variables.scss`:
- Font families: `$font-family-primary`, `$font-family-secondary`
- z-index scale: `$z-index-game-map: 100`, `$z-index-hud: 200`, `$z-index-main-menu: 300`, `$z-index-modal: 400`, `$z-index-sidebar: 500`
- Component sizes: `$in-game-menu-button-width`, `$in-game-menu-button-height`
- Map bounds: `$max-map-tiles-x`, `$max-map-tiles-y`, `$max-tile-size`
- SCSS iterator lists: `$terrain-base-list`, `$terrain-resource-list`, `$technology-list`, `$civic-list` — used in `@for`/`@each` loops to generate CSS

### Mixins
Generic utilities:
- `position-block($pos, $top, $right, $bottom, $left, $z-index?)` — full absolute/relative positioning
- `position-top-left($pos, $top, $left, $z-index?)` — shorthand for top-left anchoring
- `size($width, $height?)` — shorthand for width + height (height = width if omitted)
- `font(...)` — flexible mixin accepting family, color, size, line-height, weight, align, transform
- `disable-selection` — `user-select: none` cross-browser

Specific patterns:
- `in-game-menu-button` — shared style for menu buttons
- `sits-on-overlay` — shared style for elements floating above the map
- `fade-in-out-based-on-active-class` — CSS transition based on `.active`

---

## Web Workers

### File naming
`kebab-case.worker.ts`

### Structure
Class-based pattern using immediately instantiated anonymous class:

```typescript
import {SomeModel} from '../models/some-model';

// tslint:disable-next-line:new-parens no-unused-expression
new class WorkerName {

  readonly SOME_CONSTANT = true;

  someProperty: any;

  constructor() {
    this.init();
    this.addEventListener();
  }

  init(): void { ... }

  addEventListener(): void {
    addEventListener('message', message => this.onMessage(message));
  }

  onMessage(message: MessageEvent): void {
    // process message.data, postMessage() result back
    // @ts-ignore
    postMessage(result);
  }

}
```

- Instantiated with `new class { ... }` pattern — `@ts-ignore` / tslint suppression on the line
- Instantiated in Worker via `new Worker(new URL('./path.worker', import.meta.url), { type: 'module' })`
- `// @ts-ignore` used on `postMessage()` and `new OffscreenCanvas()` calls for missing types
