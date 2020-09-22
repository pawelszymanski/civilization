## WORKING ON
- restore html map component


## TODO
-- GENERAL
- move new map option to create game popup
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
- right click to remove selected item

## HARD PROBLEMS:
- Canvas: make tile background scale to tile size
- Canvas: make tile background move to match translate

## DONE
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
