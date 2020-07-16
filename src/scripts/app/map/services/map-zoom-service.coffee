class MapZoomService

  constructor: ->
    console.info 'MapZoomService'

    @$mapViewport = $('#map-viewport')
    @$mapWrapper = $('#map-wrapper')

    @$perspective = $('#perspective')
    @$rotateX = $('#rotate-x')
    @$scale = $('#scale')

    @initMouseWheelEvents()

  initMouseWheelEvents: =>
    @$perspective.on 'change', (event) =>
      console.info $(event.target).val()


#
#
#    @rotateX = @DEFAULT_ROTATE_X
#    @scale = @calcScale()
#    @updateDom()
#
#    @initMouseWheelEvents()
#
#  initMouseWheelEvents: =>
#    @$mapViewport.on 'wheel', (event) =>
#      if event.originalEvent.wheelDeltaY > 0 then @zoomIn() else @zoomOut()
#
#  calcScale: =>
#    rotateRange = @MAX_ROTATE_X - @MIN_ROTATE_X
#    scaleRange = @MAX_SCALE - @MIN_SCALE
#    @scale = 1 + @rotateX * scaleRange / rotateRange
#
#  zoomIn: =>
#    if @rotateX < @MAX_ROTATE_X
#      @rotateX = Math.min(@rotateX + @ROTATE_STEP, @MAX_ROTATE_X)
#      @scale = @calcScale()
#      @updateDom()
#
#  zoomOut: =>
#    if @rotateX > @MIN_ROTATE_X
#      @rotateX = Math.max(@rotateX - @ROTATE_STEP, @MIN_ROTATE_X)
#      @scale = @calcScale()
#      @updateDom()
#
#  updateDom: =>
#    @$mapViewport.css('transform', "rotateX(#{@rotateX}deg) scale(#{@scale})")
