angular.module('App.Sidebar').controller('App.Sidebar.Controller', function($scope, $state) {
  // TODO remove this hack when ui.router update
  $scope.$state = $state
})