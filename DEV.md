## WORKING ON
- move new map option to create game popup

## TODO
- options popup
- restore tile yield
- use offscreen canvas for map

## TECHNICAL TO DO
- inject ctx to map-canvas service in constructor
- use APP_INITIALIZATION injection token for size service init

## BUGS
- bug: zooming in/out is slightly off vertically

## QUESTIONS
- 

## HARD PROBLEMS / KNOWN BUGS:
- Canvas: make tile background scale to tile size
- Canvas: make tile background move to match translate
- bug: tile background pattern breaks on tiles x -1/0

## BUGS THAT WILL NOT BE FIXED
- bug: opening wold builder does not select tile before mousemove

## DONE
- bug: minimap showing up is glitched, delayed
- bug: grid is not longer draw after exiting to main menu
- bug: placing overlay vs green tiles mismatch
- N/A bug: last in row tile right bottom triangle is not clickable, same x=0 left bottom
- unzip worker
- strip extra props from tiles on save
- use separate local storage keys for each save game 
- show used local storage space indicator
- add overlay for modals
- hide hud for world builder
- enable toggling of the minimap
- bug: clear wb selected tiles on WB close
- decrease map canvas worker size: reduce imports
- fix WB: update map only one per click (rather than for each selected tile) 
- draw minimap
- the world builder: brush size
- tile ui service sphere
- the world builder: hovered tile
- the world builder: don't place anything when panning
- click coords to tile decode
- merge html and canvas maps into one component
- remove var from css
- html renderer: map wrapping
- update earth save
- extract items from constructor in services
- canvas selected tile fix
- use html overlay for events, remove cameraService.htmlSpecific
- extract map zoom service
- extract size service
- extract pain map on canvas service
- canvas: draw full canvas on the OnInit
- create sample map and put it in main menu
- right click to remove selected world builder tool
- add tile feature / resource / improvement validation
- fix tile pipes not to execute all the time
- restore font awesome
- html map: update tile css classes on tile change
- restore html map component
- use background colors for tiles on canvas 
- make sure all components have ngOnDestroy 
- save MapUi in save
- can't pan after 2 loads
- endless horizontal scrolling
- remove font awesome
- make dev tools component .component class
- play now generates map
- add scale to camera dev tools
- performance meter const TODO comment
- toggle grid
- tile info for canvas

  

## TO TEST
- using el.classList.add / remove
- requestIdleCallback()
- do not sanitize styles: this._domSanitizer.bypassSecurityTrustStyle(`repeat(auto-fit,minmax(256px,1fr))`)
- the preconnect option on the rel attribute: https://medium.com/javascript-in-plain-english/improve-css-performance-in-3-easy-ways-1ce3632e2cdc




## Lessons learned
- remove hover on tile since it was causing 17ms Update Layer tree
- move change detection to OnPush to save 8ms
- pointer-events: none; blocks events, also in children. But at a cost of a 50% of frame rate drop!!
- your JSON can grow huge quickly (as in a save game with yield data)!
- replace events on tiles to an overlay to remove hit tests  
- replace `calc(var(--tile-size) */+ x)` into size-xx classes, that did change recalculate style 60s + other 10ms into recalc style 25, layout 6, layer tree 10, paint 12; total savings of 17ms = ~25% PLUS spread one big blocking time nto few
- remove two components per tile with *ngIf="mapUi.infoOverlay === TileInfoOverlayId.xxx", ~3ms on frame on change detection
- clip path % => px => + 13% = FPS 26.6 ??????????
- contain: strict === contain: layout style size; slows down rendering, but why?
- remove big imports from workers as those will be placed inline in the worker module during compilation: ~1500 lines => ~400 lines of compiled worked module from TERRAIN_BASE_SET => TERRAIN_BASE_TO_COLOR_MAP 
- *ngFor="let tile of visible(map.tiles)" => increases paint time 2ms -> 6ms
- `        &:nth-of-type(2n+1) {
             &.m-x-#{$i} {
               background-position-x: $i * 125%;
             }
           }
           &:nth-of-type(2n+0) {
             &.m-x-#{$i} {
               background-position-x: $i * 125% + 62.5%;
             }
           }
` => &.m-odd => 17.5ms => 16.0ms style calc
- `.map-compponent {.map {.tile {}}}` => `.tile {}` +1.2FPS on full screen 60px!
- `this.ngZone.runOutsideAngular(() => {
     this.document.addEventListener('mousemove', this.dragHandlerRef as any);
   });` to avoid detect changes on mouse move
- pure pipe of TileCssClassesPipe to not execute classes, only style changes
- remove shadow from tiles and text `this.setCtxShadow('black', 2, 0, 0);` => full map 20px 11.7 => 25.4 FPS, use .5 in canvas to draw shadowy shapes 
- Make grid draw only 3 sides so tiles can share grid lines 
```javascript
  private paintGrid(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[4].x, tile.px.y + this.size.vertices[4].y);
    this.ctx.lineTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y);
    this.ctx.closePath();
    this.ctx.stroke();
  }
```
=>
```javascript
  private paintGridThreeSides(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[1].x, tile.px.y + this.size.vertices[1].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[2].x, tile.px.y + this.size.vertices[2].y - 1);
    this.ctx.lineTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y - 1);
    this.ctx.stroke();
  }

  private paintGridTopLeft(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[5].x, tile.px.y + this.size.vertices[5].y + 0.5);
    this.ctx.lineTo(tile.px.x + this.size.vertices[0].x, tile.px.y + this.size.vertices[0].y + 0.5);
    this.ctx.stroke();
  }

  private paintGridBottomLeft(tile: Tile): void {
    this.ctx.beginPath();
    this.ctx.moveTo(tile.px.x + this.size.vertices[3].x, tile.px.y + this.size.vertices[3].y - 1);
    this.ctx.lineTo(tile.px.x + this.size.vertices[4].x, tile.px.y + this.size.vertices[4].y - 1);
    this.ctx.stroke();
  }
```
=> ~3ms on earth for 20px tile (full map)

## IDEAS TO SPEED UP 
1. Use modern CSS over JS calculations 
1. imageDecode in web worker:
fetch(filename).then(response => {
  response.blob().then(blob => {
    createImageBitmap(blob).then(image => {
    }
  });
});
1. Offscreen canvas
var offscreen = canvas.transferControlToOffscreen();
var context = offscreen.getContext('2d');
1. Isolate animation to a worker
1. Use transform and opacity rather any other style (STYLE > LAYOUT > PAIN > COMPOSITE)
1. Don't check .innerWidth ets as this would force full repaint
1. Web Assembly for huge operations
1. Use pure pipes when possible to avoid recalculations
1.  

