class DevToolsCtrl
  constructor: ($scope, storeService) ->

    $scope.mapGenerator =
      rows: 15
      columns: 15

    $scope.zoomControl =
      tileSize: 100
      perspective: 1000
      rotateX: 0
      scale: 1

