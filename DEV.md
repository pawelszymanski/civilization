## WORKING ON
- merge html and canvas maps into one component
- use APP_INITIALIZATION injection token for size service init
- minimap

## TODO
- move new map option to create game popup

-- GENERAL
- options popup
- map details: map name and description

-- CANVAS
- iterate on eventTargetTile
- restore tile yield
- add terrain features
- add terrain resources
- click coords to tile decode

-- WORLD BUILDER:
- hide hud for world builder
- don't place anything when panning
- brush size

## HARD PROBLEMS:
- Canvas: make tile background scale to tile size
- Canvas: make tile background move to match translate

## DONE
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





## Lessons learned
- remove hover on tile since it was causing 17ms Update Layer tree
- move change detection to OnPush to save 8ms
- pointer-events: none; blocks events, also in children. But at a cost of a 50% of frame rate drop!!
- your JSON can grow huge quickly (as in a save game with yield data)!
- replace events on tiles to an overlay to remove hit tests  
- replace `calc(var(--tile-size) */+ x)` into size-xx classes, that did change recalculate style 60s + other 10ms into recalc style 25, layout 6, layer tree 10, paint 12; total savings of 17ms = ~25% PLUS spread one big blocking time nto few
- remove two components per tile with *ngIf="mapUi.infoOverlay === TileInfoOverlayId.xxx", ~3ms on frame on change detection

 

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

