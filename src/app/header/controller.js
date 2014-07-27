angular.module('App.Header').controller('App.Header.Controller', function($scope, $translatePartialLoader) {
  $translatePartialLoader.addPart('app/header');
})