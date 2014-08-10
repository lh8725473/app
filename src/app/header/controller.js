angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  function(
    $scope,
    $translatePartialLoader
  ) {
    $translatePartialLoader.addPart('app/header');
  }
])