angular
  .module('devToolsModule', [])
  .controller('devToolsCtrl', ['$scope', 'storeService', DevToolsCtrl($scope, storeService)])
  .service('mapGeneratorService', MapGeneratorService)
