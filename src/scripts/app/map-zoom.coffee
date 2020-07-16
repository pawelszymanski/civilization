class MapZoom

  constructor: ->
    @ROTATE_STEP = 3  # deg
    @DEFAULT_ROTATE_X = 20
    @MIN_ROTATE_X = 10
    @MAX_ROTATE_X = 35
    @MIN_SCALE = 1.00
    @MAX_SCALE = 1.35

    @$mapViewport = $('#map-viewport')
    @$mapWrapper = $('#map-wrapper')

    @rotateX = @DEFAULT_ROTATE_X
    @scale = @calcScale()
    @updateDom()

    @initMouseWheelEvents()

  initMouseWheelEvents: =>
    @$mapViewport.on 'wheel', (event) =>
      if event.originalEvent.wheelDeltaY > 0 then @zoomIn() else @zoomOut()

  calcScale: =>
    rotateRange = @MAX_ROTATE_X - @MIN_ROTATE_X
    scaleRange = @MAX_SCALE - @MIN_SCALE
    @scale = 1 + @rotateX * scaleRange / rotateRange

  zoomIn: =>
    if @rotateX < @MAX_ROTATE_X
      @rotateX = Math.min(@rotateX + @ROTATE_STEP, @MAX_ROTATE_X)
      @scale = @calcScale()
      @updateDom()

  zoomOut: =>
    if @rotateX > @MIN_ROTATE_X
      @rotateX = Math.max(@rotateX - @ROTATE_STEP, @MIN_ROTATE_X)
      @scale = @calcScale()
      @updateDom()

  updateDom: =>
    @$mapViewport.css('transform', "rotateX(#{@rotateX}deg) scale(#{@scale})")



$ ->
  window.MapZoom = new MapZoom()
