gi# AI Codebase Review

**Date:** 2026-05-23
**Project:** Civilization (Angular strategy game)

---

## Architecture Overview

Angular 10 TypeScript application — a Civilization-like hex-based strategy game.

| Layer | Technology |
|---|---|
| Frontend | Angular 10 + TypeScript |
| State | Custom BehaviorSubject stores (no NgRx) |
| Rendering | Canvas API, hex-grid tiles |
| Workers | Web Workers (zip compression, minimap rendering) |
| Storage | localStorage + LZ-String compression |

---

## Findings

### 🐛 Bugs

#### 1. Off-by-one in bounds check
**File:** `src/app/services/tile-ui.service.ts:90`
```typescript
if ( y < 0 || y > this.map.height ) { return null; }
//                 ^ should be >=
```
`y === this.map.height` passes the guard and produces an out-of-bounds tile array access downstream.

---

#### 2. Swapped variable names in `areGridCoordsValid`
**File:** `src/app/services/tile-ui.service.ts:81-82`
```typescript
const isYok = (gridCoords.x >= 0 && gridCoords.x < this.map.width);   // checks X, named Y
const isXok = (gridCoords.y >= 0 && gridCoords.y < this.map.height);  // checks Y, named X
```
Logic is correct but names are inverted. A future editor targeting the wrong axis could introduce a real bug.

---

#### 3. `getFilteredAndSortedSaveHeaders` has no default return
**File:** `src/app/components/modals/save-and-load/load-game/load-game.component.ts:77-98`
```typescript
getFilteredAndSortedSaveHeaders(): SaveHeader[] {
  // four if-returns covering all current enum values
  // no else / fallthrough return
}  // implicitly returns undefined if enum gains a new value
```
TypeScript does not error because the return type is not declared as `| undefined`. Safe with the current enum, but fragile.

---

#### 4. Hardcoded Google URL as "Exit Game" action
**File:** `src/app/components/modals/menus/exit-game-confirmation/exit-game-confirmation.component.ts:22`
```typescript
onYesClick() {
  window.location.href = 'http://google.com';  // placeholder never replaced
}
```
Clicking "Yes" on the exit confirmation navigates to Google instead of closing or resetting the game.

---

### 💧 Memory Leaks

#### 5. Minimap Web Worker never terminated
**File:** `src/app/components/hud/mini-map/mini-map.component.ts:60-63`
```typescript
ngOnDestroy() {
  this.unsubscribeFromData();
  this.cancelAnimationFrame();
  // missing: this.canvasWorker.terminate();
}
```
The worker is created in `ngOnInit` but `ngOnDestroy` never calls `.terminate()`, leaving it running indefinitely.

---

#### 6. New zip Worker created per save, never terminated
**File:** `src/app/services/save.service.ts:63-70`
```typescript
const worker = new Worker('./../workers/zip.worker', {type: 'module'})
worker.postMessage(saveData);
worker.onmessage = (message) => {
  this.localStorageService.set(key, zippedSaveData);
  // missing: worker.terminate();
}
```
Every save spawns a fresh Worker that is never cleaned up.

---

### ⚠️ Missing Error Handling

#### 7. `localStorage.setItem` quota errors are swallowed
**File:** `src/app/services/local-storage.service.ts:22-23`
```typescript
public set(key: string, value: any): void {
  this.localStorage.setItem(key, JSON.stringify(value));  // throws QuotaExceededError silently
}
```
No try-catch, no user notification. A failed save appears successful to the player.

---

#### 8. No `worker.onerror` on the zip Worker
**File:** `src/app/services/save.service.ts:63-70`

If the zip Worker crashes, the error is silently discarded with no feedback.

---

### 🔒 Type Safety

#### 9. Double-cast through `undefined`
**File:** `src/app/services/keyboard.service.ts:22`
```typescript
const userActionIds: UserActionId[] = Object.keys(keyBindings).map(id => id as undefined as UserActionId);
```
`as undefined` is a meaningless intermediate cast that only works because TypeScript permits it. Should be `as UserActionId` directly, or use a typed key accessor.

---

### 🔀 Inconsistency

#### 10. Mixed `null` / `undefined` for the same field
**File:** `src/app/components/modals/save-and-load/load-game/load-game.component.ts:73, 124, 134`
```typescript
this.selectedSaveUuid = null;      // line 73
this.selectedSaveUuid = undefined;  // lines 124, 134
```
Same field is "cleared" with two different sentinel values across three call sites.

---

### 🗑️ Dead Code

#### 11. Large commented-out block
**File:** `src/app/components/modals/save-and-load/load-game/load-game.component.ts:141-163`

An old RxJS-based `ngOnInit` implementation left in comments. Should be deleted.

---

## Summary

| # | Severity | Location | Description |
|---|---|---|---|
| 1 | Bug | `tile-ui.service.ts:90` | Off-by-one in Y bounds check |
| 2 | Bug | `tile-ui.service.ts:81-82` | Swapped variable names `isXok`/`isYok` |
| 3 | Bug | `load-game.component.ts:77-98` | Missing fallthrough return |
| 4 | Bug | `exit-game-confirmation.component.ts:22` | Hardcoded Google exit URL |
| 5 | Memory leak | `mini-map.component.ts:60-63` | Worker not terminated on destroy |
| 6 | Memory leak | `save.service.ts:63-70` | New worker per save, never terminated |
| 7 | Error handling | `local-storage.service.ts:22-23` | Quota errors silently swallowed |
| 8 | Error handling | `save.service.ts:63-70` | No `worker.onerror` handler |
| 9 | Type safety | `keyboard.service.ts:22` | Nonsense `as undefined` cast |
| 10 | Inconsistency | `load-game.component.ts:73,124,134` | `null` vs `undefined` for same field |
| 11 | Dead code | `load-game.component.ts:141-163` | Commented-out old implementation |
