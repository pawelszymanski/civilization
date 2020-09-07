## TODO
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

## DONE
- add scale to camera dev tools

+  encapsulation: ViewEncapsulation.None,
+  changeDetection: ChangeDetectionStrategy.OnPush

+    private ngZone: NgZone,
+    private cdr: ChangeDetectorRef,

+  requestAnimationFrame() {
+    window.requestAnimationFrame(() => {
+      this.requestAnimationFrame();
+      this.cdr.detectChanges();
+    });


+  ngOnInit() {
+    this.subscribeToData();
+    this.requestAnimationFrame();
+  }

## TO TEST
- using el.classList.add / remove





## Lessons learned
- remove hover on tile since it was causing 17ms Update Layer tree
 


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
 
