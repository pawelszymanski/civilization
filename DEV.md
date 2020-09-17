unsub strategic



## TODO

- performance meter const TODO comment

- play now generates map
- remove font awesome
- make resources and improvements have more visuals
- hide hud for world builder
- make dev tools component .component class
- don't place anything when panning
- brush size
- right click to remove selected item
- map details: map name and description
- onWheel do use scale rather than var --tile-size 
- 3ms: tile-yield-component + tile-text-component bindings
## DONE
- add scale to camera dev tools





  


  

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
