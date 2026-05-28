# Code Analysis — C:\dev\civilization

### ANG-1 · Missing trackBy on every *ngFor (12 instances)
### ANG-3 · No OnPush change detection — 18 of 20 components



### ANG-4 · Manual subscriptions where async pipe should be used
- `src/app/components/modals/save-and-load/load-game/load-game.component.ts:59` — subscribes to write this.saveHeaders for template.
- A reactive pipeline + async pipe would also eliminate the BUG-2 missing-return bug.
- `src/app/components/main-menu/main-menu.component.ts:56` — subscribes to write this.saveHeaders for the noSavesPresent getter.

### ANG-10 · StatusBarComponent is dead code
`src/app/components/hud/status-bar/status-bar.component.ts:27-31`

subscribeToData() calls this.subscriptions.push(/* TODO... */) with no argument. Template shows hardcoded 12.3. Full OnInit/OnDestroy boilerplate for zero functionality. Either implement or remove.

---

## MEDIUM — RxJS Problems (5)

### RXJ-1 · Subscribe-assign pattern as mutable state cache (20+ instances)

store.stream.subscribe(v => this.field = v) used as a poor-man's cache across all 6 services. For providedIn: 'root' singletons, prefer store.stream.getValue() at call sites — no subscription needed.

Affected: camera.service.ts:22 · map-canvas.service.ts:61-69 · map-zoom.service.ts:31-32 · size.service.ts:30-31 · tile-ui.service.ts:28-30 · world-builder.service.ts:26-27

## LOW — Code Smells & Maintainability (12)

### SME-2 · Unresolved TODO/BUG markers (6)

| File | Line | Note |
|------|------|------|
| src/app/consts/performance-meter.const.ts | 10-11 | alpha bug — passes 10 instead of e.g. 0.4; legend always fully opaque |
| src/app/components/map/map.component.ts | 135 | drag not disabled when mouse leaves window |
| src/app/components/hud/status-bar/status-bar.component.ts | 29 | subscription placeholder only |

### SME-3 · Commented-out code (4 blocks)
- src/app/components/modals/save-and-load/load-game/load-game.component.ts:141-163 — abandoned combineLatest ngOnInit
- src/app/components/main-menu/main-menu.component.html:17-31 — commented options menu block

### SME-4 · Explicit any at storage boundaries (7 usages)
- src/app/services/zip.service.ts:8,13 — zip(data: any), unzip(): any
- src/app/services/local-storage.service.ts:18,22 — get(): any, set(value: any)
- src/app/components/app/app.component.ts:67 — documentOnWheel(event) missing type (should be WheelEvent)
- src/app/workers/minimap-canvas.worker.ts:13-14 — canvas: any; ctx: any (documented OffscreenCanvas workaround)

### SME-6 · TypeScript cast anti-pattern
src/app/services/keyboard.service.ts:22 — id as undefined as UserActionId should be as unknown as UserActionId.

### SME-8 · createEmptyOceanTile double-casts to bypass type system
src/app/services/map-generator.service.ts:31 — created object is missing required Tile fields (isVisible, px). Model and factory are out of sync.

### SME-11 · tile.isVisible evaluated three times per tile in map template
src/app/components/map/map.component.html:19-21 — three separate bindings each read tile.isVisible per tile per CD cycle. Wrap in <ng-container *ngIf="tile.isVisible"> instead.
