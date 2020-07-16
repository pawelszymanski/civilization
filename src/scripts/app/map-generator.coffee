class MapGenerator

  constructor: ->
    @$mapViewport = $('#map-viewport')
    @$mapWrapper = $('#map-wrapper')

    @initMouseWheelEvents()

  initMouseWheelEvents: =>
    $('#generate-map-button').on 'click', () =>
      rows = $('#rows').val()
      columns = $('#columns').val()

      @$mapWrapper
        .detach()
        .empty()

      @populateMapWrapperElem(rows, columns)

      @$mapViewport
        .append(@$mapWrapper)

  populateMapWrapperElem: (rows, columns) =>
    for rowId in [1..rows]
      row = @createRowElem(rowId)
      for columnId in [1..columns]
        tile = @createTileElem(rowId, columnId)
        row.append(tile)
      @$mapWrapper.append(row)

  createRowElem: (rowId) =>
    $("<div class='map-row'></div>").css('z-index', rows - rowId)

  createTileElem: (rowId, columnId) =>
    $("<div class='map-tile'></div>").text("#{columnId}, #{rowId}")


$ ->
  window.MapGenerator = new MapGenerator()
