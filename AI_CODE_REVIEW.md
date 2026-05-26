# Code Analysis — C:\dev\civilization

**Scanned:** 91 TypeScript files · 19 HTML templates
**Issues found:** 43 (2 critical · 13 high · 16 medium · 12 low)

---

## HIGH — Bugs (13)

### BUG-1 · TOGGLE_GRID runs independently on every keydown (broken else-if chain)
`src/app/components/app/app.component.ts:98-99`

```ts
if (userActionId === UserActionId.TOGGLE_MINIMAP) { ... }  // part of else-if chain
if (userActionId === UserActionId.TOGGLE_GRID)    { ... }  // STANDALONE if — no else
```

Line 99 breaks the else-if chain. toggleGrid() is called on every keydown event, not only when the grid key is pressed.

### BUG-2 · getFilteredAndSortedSaveHeaders() returns undefined on unmatched sort order
`src/app/components/modals/save-and-load/load-game/load-game.component.ts:77`

Four independent if branches each return, but there is no else/default and no final return result. Return type is declared SaveHeader[]. If sortOrder is null (form init), out-of-range, or a new enum is added, the function returns undefined. The caller immediately assigns it to this.filteredAndSortedSaveHeaders fed into *ngFor — runtime crash. Fix: add return result; after the four if blocks.

### BUG-3 · Unsafe null dereference on .find() and .pop() results
- `src/app/components/main-menu/main-menu.component.ts:84-85` — .find() returns SaveHeader | undefined; next line accesses .uuid with no null check.
- `src/app/components/main-menu/main-menu.component.ts:95-97` — MAP_SIZE_SETTINGS_LIST.find() result used for .width/.height with no null check.
- `src/app/pipes/technology-tree-era-elem-class.pipe.ts:12` — .sort().pop() + 1 — pop() returns undefined on empty array; undefined + 1 = NaN produces CSS class m-columns-NaN, silently breaking the tech tree layout.
- `src/app/pipes/civic-tree-era-elem-class.pipe.ts:12` — same pattern. Fix: (.sort().pop() ?? 0) + 1.

### BUG-4 · Off-by-one in tile grid bounds check
`src/app/services/tile-ui.service.ts:90`

```ts
if ( y < 0 || y > this.map.height ) { return null; }   // should be >= not >
```

When y === map.height the guard passes. The resulting index x * map.height + y is one past the last tile — map.tiles[index] returns undefined. Compare with line 165 in the same file which correctly uses y < this.map.height.

### BUG-5 · findMatchingActionId implicitly returns undefined
`src/app/services/keyboard.service.ts:21-29`

Return type is UserActionId but no fallthrough return exists. When no key binding matches (any unbound key), returns undefined. Used as array index / switch discriminant in app.component.ts:87 — callers silently misbehave.

### BUG-6 · Truthy check on enum value 0 — fragile yield calculations
`src/app/services/tile-yield.service.ts:45, 50, 54`

```ts
if (tile.terrain.feature.id)    { ... }  // TerrainFeatureId.NONE = 0, falsy
if (tile.terrain.resourceId)    { ... }  // TerrainResourceId.NONE = 0, falsy
if (tile.terrain.improvementId) { ... }  // same
```

Only works because NONE = 0. If any enum is reordered, all three checks silently break and yield is miscalculated for every tile. The same file uses explicit === TerrainFeatureId.ICE at line 38.

### BUG-7 · MapStore.updateTiles mutates and re-emits the same object reference
`src/app/stores/map.store.ts:40-47`

```ts
const map = this._map.getValue();  // get current reference
map.tiles[tileIndex] = tile;       // mutate in-place
this.next(map);                    // emit the same reference
```

Consumers using distinctUntilChanged() or OnPush change detection see no change. MapComponent uses OnPush — tile updates will silently not re-render.

### BUG-8 · SaveService.save worker has no error handler — saves silently fail
`src/app/services/save.service.ts:63-71`

No worker.onerror registered. If worker throws: error silently ignored, worker.terminate() never called (worker leaks), save header already written to SaveHeadersStore — UI shows a phantom save with no data.

### BUG-9 · dragStartCoords uninitialized — null dereference on early mouseup
`src/app/components/map/map.component.ts:155`

```ts
const dragDistance = this.vectorLength({x: event.pageX, y: event.pageY}, this.dragStartCoords);
```

dragStartCoords declared Coords with no initializer. If mouseup fires before any mousedown on the canvas, this.dragStartCoords is undefined and vectorLength crashes.

### BUG-10 · mousemove drag listener not removed on component destroy
`src/app/components/map/map.component.ts:195-219`

startDrag() attaches document.addEventListener('mousemove', this.dragHandlerRef). ngOnDestroy() does not call stopDrag(). If the component is destroyed mid-drag, the listener remains on document indefinitely.

### BUG-11 · Three document event listeners never removed
`src/app/components/app/app.component.ts:58-60`

```ts
document.addEventListener('wheel',       this.documentOnWheel.bind(this),    {passive: false});
document.addEventListener('contextmenu', this.documentOnContextMenu.bind(this));
document.addEventListener('keydown',     this.documentOnKeydown.bind(this));
```

.bind(this) creates new anonymous references not stored anywhere. ngOnDestroy() only calls unsubscribeFromData() — removeEventListener is never called. Each app instantiation accumulates permanent document-level listeners.

### BUG-12 · Subscription leaks in six singleton services

All six services subscribe in their constructors and never unsubscribe. As singletons they survive without production leaks, but SizeService window.resize listener is a genuine leak, and all prevent clean unit testing:

| File | Lines | Subscriptions |
|------|-------|---------------|
| src/app/services/camera.service.ts | 22 | 1 |
| src/app/services/map-zoom.service.ts | 31-32 | 2 |
| src/app/services/tile-ui.service.ts | 28-30 | 3 |
| src/app/services/world-builder.service.ts | 26-27 | 2 |
| src/app/services/map-canvas.service.ts | 61-69 | 5 |
| src/app/services/size.service.ts | 30-31, 45 | 2 + window.resize (genuine leak — anonymous arrow, removeEventListener impossible) |

### BUG-13 · LocalStorageService.getUsage measures characters, not megabytes
`src/app/services/local-storage.service.ts:30-41`

Variable named totalMb accumulates string character count. MAX_USED_SPACE = 1024 * 1024 compared against chars, not bytes — percentage threshold off by ~2x. Also, hasOwnProperty(x) checked twice (lines 33 and 35); inner check always redundant.

---

## MEDIUM — Angular Anti-patterns (11)

### ANG-1 · Missing trackBy on every *ngFor (12 instances)

Without trackBy, Angular destroys and recreates every DOM node in a list whenever the array reference changes.

| File | Line | List | Impact |
|------|------|------|--------|
| src/app/components/map/map.component.html | 18 | map.tiles | Critical — thousands of tiles recreated on every map update |
| src/app/components/modals/research/technology-tree/technology-tree.component.html | 5-6 | eras to technologies (nested) | High |
| src/app/components/modals/research/civic-tree/civic-tree.component.html | 5-6 | eras to civics (nested) | High |
| src/app/components/modals/save-and-load/load-game/load-game.component.html | 14 | save headers | Medium |
| src/app/components/sidebars/world-builder/world-builder.component.html | 33,41,49,57 | terrain type lists | Low (static) |
| src/app/components/hud/status-bar/status-bar.component.html | 4 | yield IDs | Low (static) |
| src/app/components/sidebars/dev-tools/components/generate-map-form/generate-map-form.component.html | 5 | map size settings | Low (static) |

### ANG-2 · Method calls in template bindings — run every CD cycle
- `src/app/components/modals/save-and-load/load-game/load-game.component.html:15` — [class.active]="isSaveGameHeaderSelected(save)" called per list item per cycle.
- `src/app/components/modals/save-and-load/save-game/save-game.component.html:14` — [class.disabled]="!canGameBeSaved()" reads usedStoragePc, saveName, and map on every cycle.

Fix: cache as component properties updated on relevant changes, or convert to pure pipes.

### ANG-3 · No OnPush change detection — 18 of 20 components

Only map.component.ts and performance-chart.component.ts use ChangeDetectionStrategy.OnPush. All others re-run on any event anywhere in the tree:

app.component.ts:14 · main-menu.component.ts:21 · mini-map.component.ts:17 · quick-links.component.ts:11 · status-bar.component.ts:6 · world-builder.component.ts:18 · dev-tools.component.ts:3 · screen-center-marker.component.ts:3 · camera-form.component.ts:16 · civic-tree.component.ts:10 · in-game-menu.component.ts:14 · technology-tree.component.ts:10 · exit-game-confirmation.component.ts:5 · save-game.component.ts:18 · game-options-menu.component.ts:3 · save-details.component.ts:5 · generate-map-form.component.ts:18 · load-game.component.ts:18

### ANG-4 · Manual subscriptions where async pipe should be used
- `src/app/components/modals/save-and-load/load-game/load-game.component.ts:59` — subscribes to write this.saveHeaders for template. A reactive pipeline + async pipe would also eliminate the BUG-2 missing-return bug.
- `src/app/components/main-menu/main-menu.component.ts:56` — subscribes to write this.saveHeaders for the noSavesPresent getter.

### ANG-5 · Swapped variable names isXok / isYok
`src/app/services/tile-ui.service.ts:81-82`

```ts
const isYok = (gridCoords.x >= 0 && gridCoords.x < this.map.width);   // checks X
const isXok = (gridCoords.y >= 0 && gridCoords.y < this.map.height);  // checks Y
```

Names are inverted. Logic is still correct (both &&-ed), but any future edit to validate only one axis will silently check the wrong one.

### ANG-6 · Pipes registered in both declarations and providers
`src/app/app.module.ts:163, 174`

The PIPES array is spread into both declarations and providers. Pipes belong only in declarations. The providers entry unnecessarily makes all 11 pipes injectable services app-wide.

### ANG-7 · Pipes injected into MapCanvasService as rendering dependencies
`src/app/services/map-canvas.service.ts:52-55`

Four Angular transform pipes are constructor-injected into a canvas service. Couples service layer to presentation layer. Name resolution belongs in a dedicated utility service.

### ANG-8 · Window injected as a raw class token
`src/app/app.module.ts:171`

Should use an InjectionToken<Window>. Additionally, src/app/services/size.service.ts:45 references the global window directly, defeating the purpose of the DI setup.

### ANG-9 · PerformanceChartComponent interval runs inside Angular zone
`src/app/components/sidebars/dev-tools/components/performance-chart/performance-chart.component.ts:79`

interval(500).subscribe() triggers full change detection every 500ms. The requestAnimationFrame loop in the same component correctly runs outside the zone (line 72). The interval should also use ngZone.runOutsideAngular.

### ANG-10 · StatusBarComponent is dead code
`src/app/components/hud/status-bar/status-bar.component.ts:27-31`

subscribeToData() calls this.subscriptions.push(/* TODO... */) with no argument. Template shows hardcoded 12.3. Full OnInit/OnDestroy boilerplate for zero functionality. Either implement or remove.

### ANG-11 · Stores expose a public next() passthrough
All nine stores expose public next(value) alongside named action methods:

src/app/stores/camera.store.ts:22 · src/app/stores/map.store.ts:28 · src/app/stores/gameplay-ui.store.ts · src/app/stores/size.store.ts · src/app/stores/save-headers.store.ts · src/app/stores/world-builder-hovered-tiles.store.ts

Any caller can push arbitrary state, bypassing named-action semantics. Observed in practice: mini-map.component.ts, map-zoom.service.ts, and map.component.ts call store.next() directly.

---

## MEDIUM — RxJS Problems (5)

### RXJ-1 · Subscribe-assign pattern as mutable state cache (20+ instances)

store.stream.subscribe(v => this.field = v) used as a poor-man's cache across all 6 services. For providedIn: 'root' singletons, prefer store.stream.getValue() at call sites — no subscription needed.

Affected: camera.service.ts:22 · map-canvas.service.ts:61-69 · map-zoom.service.ts:31-32 · size.service.ts:30-31 · tile-ui.service.ts:28-30 · world-builder.service.ts:26-27

### RXJ-2 · paintTileInfoYield is a broken silent no-op
`src/app/services/map-canvas.service.ts:140-142`

```ts
private paintTileInfoYield(tile: Tile): void {
  // TODO
}
```

Called on every animation frame for every visible tile when infoOverlay === TileInfoOverlayId.YIELD. The yield overlay is permanently non-functional.

### RXJ-3 · ViewEncapsulation.None on all components
All components disable Angular shadow-DOM style encapsulation, making CSS globally scoped. Increases risk of style collisions.

### RXJ-4 · PerformanceChartComponent interval drives unnecessary change detection
`src/app/components/sidebars/dev-tools/components/performance-chart/performance-chart.component.ts:79`
Fires inside the Angular zone, driving CD every 500ms even when the component is not visible.

### RXJ-5 · Non-standard CSS class component selectors throughout
All components use .class-name selectors instead of app-xyz element selectors. Breaks Angular DevTools, CLI schematics, and ng-content slot matching.

---

## LOW — Code Smells & Maintainability (12)

### SME-1 · Zero unit test coverage
No *.spec.ts files exist anywhere in src/app/. All bugs above are undetectable by automated testing.

### SME-2 · Unresolved TODO/BUG markers (6)

| File | Line | Note |
|------|------|------|
| src/app/consts/performance-meter.const.ts | 10-11 | alpha bug — passes 10 instead of e.g. 0.4; legend always fully opaque |
| src/app/components/map/map.component.ts | 135 | drag not disabled when mouse leaves window |
| src/app/components/main-menu/main-menu.component.ts | 73 | onOptionsClick() is empty |
| src/app/components/main-menu/main-menu.component.ts | 118 | onCreateGameClick() unimplemented |
| src/app/services/map-canvas.service.ts | 141 | yield overlay unimplemented (see RXJ-2) |
| src/app/components/hud/status-bar/status-bar.component.ts | 29 | subscription placeholder only |

### SME-3 · Commented-out code (4 blocks)
- src/app/components/map/map.component.ts:229-250 — dead onDblclick handler referencing a removed method
- src/app/services/map-canvas.service.ts:177-188 — dead paintMapDecoration/setCtxShadow methods
- src/app/components/modals/save-and-load/load-game/load-game.component.ts:141-163 — abandoned combineLatest ngOnInit
- src/app/components/main-menu/main-menu.component.html:17-31 — commented options menu block

### SME-4 · Explicit any at storage boundaries (7 usages)
- src/app/services/zip.service.ts:8,13 — zip(data: any), unzip(): any
- src/app/services/local-storage.service.ts:18,22 — get(): any, set(value: any)
- src/app/components/app/app.component.ts:67 — documentOnWheel(event) missing type (should be WheelEvent)
- src/app/workers/minimap-canvas.worker.ts:13-14 — canvas: any; ctx: any (documented OffscreenCanvas workaround)

### SME-5 · Dead dependency injections
- src/app/stores/save-headers.store.ts:23 — injects TileYieldService, never referenced
- src/app/components/modals/save-and-load/load-game/load-game.component.ts:42-44 — injects CameraStore, MapStore, GameplayUiStore; all unused
- src/app/components/modals/research/technology-tree/technology-tree.component.ts:21 and civic-tree.component.ts:21 — declare ui: Ui field, never used

### SME-6 · TypeScript cast anti-pattern
src/app/services/keyboard.service.ts:22 — id as undefined as UserActionId should be as unknown as UserActionId.

### SME-7 · Math.random() for save UUIDs — not cryptographically secure
src/app/services/generator.service.ts:9-13 — Use crypto.randomUUID() instead.

### SME-8 · createEmptyOceanTile double-casts to bypass type system
src/app/services/map-generator.service.ts:31 — created object is missing required Tile fields (isVisible, px). Model and factory are out of sync.

### SME-9 · Magic numbers in hexagonal geometry
src/app/services/size.service.ts:51-66 — inline ratios 0.9, 0.50, 0.25, 0.75 with no names or geometric comments.

### SME-10 · Filename typo
src/app/pipes/ciciv-name.pipe.ts should be civic-name.pipe.ts. Class and selector are correctly spelled; only the filename has the transposition.

### SME-11 · tile.isVisible evaluated three times per tile in map template
src/app/components/map/map.component.html:19-21 — three separate bindings each read tile.isVisible per tile per CD cycle. Wrap in <ng-container *ngIf="tile.isVisible"> instead.

### SME-12 · ViewEncapsulation.None everywhere makes styles globally scoped
All components set encapsulation: ViewEncapsulation.None. Any style rule can affect any component unintentionally.

---

## Summary

| Severity | Count |
|----------|-------|
| Critical | 2 |
| High | 13 |
| Medium | 16 |
| Low | 12 |
| **Total** | **43** |

**Top 5 to fix first:**
1. src/app/components/app/app.component.ts:99 — BUG-1: TOGGLE_GRID fires on every keydown (add else before line 99)
2. src/app/components/modals/save-and-load/load-game/load-game.component.ts:77 — BUG-2: add return result; to prevent *ngFor crash on sort
3. src/app/services/save.service.ts:63 — BUG-8: add worker.onerror to prevent phantom saves
4. src/app/services/tile-ui.service.ts:90 — BUG-4: change y > map.height to y >= map.height
5. src/app/services/local-storage.service.ts:19 + src/app/services/zip.service.ts:14 — SEC-2: wrap JSON.parse in try/catch
