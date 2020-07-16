class MapDrag

  constructor: ->
    @isMouseDownMoving = false
    @isDraggingMap = false
    @dragStartCoords = undefined

    @$mapViewport = $('#map-viewport')
    @$mapWrapper = $('#map-wrapper')

    @initMouseDownEvents()
    @initMouseUpEvents()

  initMouseDownEvents: =>
    @$mapViewport.on 'mousedown', (event) =>
      if event.button == 0
        @saveDragStartCoords(event)
        @isMouseDownMoving = true
        $(document).on 'mousemove.map-drag', (event) =>
          @updateDrag(event)

  initMouseUpEvents: =>
    $(document).on 'mouseup', () =>
      if @isMouseDownMoving
        $(document).off 'mousemove.map-drag'
        @isMouseDownMoving = false
        @isDraggingMap = false

  saveDragStartCoords: (event) =>
    @dragStartCoords =
      pageX: event.pageX
      pageY: event.pageY
      mapWrapperElemTop: parseInt(@$mapWrapper.css('top'))
      mapWrapperElemLeft: parseInt(@$mapWrapper.css('left'))

  updateDrag: (event) =>
    offsetX = event.pageX - @dragStartCoords.pageX
    offsetY = event.pageY - @dragStartCoords.pageY

    if not @isDraggingMap
      if Math.abs(offsetX) >= 10 || Math.abs(offsetY) >= 10
        @isDraggingMap = true

    if @isDraggingMap
      top = @dragStartCoords.mapWrapperElemTop + offsetY
      if top > 0 then top = 0
#      maxTop =
      newPosition =
        top: top
        left: @dragStartCoords.mapWrapperElemLeft + offsetX
      @$mapWrapper.css newPosition



$ ->
  window.MapDrag = new MapDrag()
