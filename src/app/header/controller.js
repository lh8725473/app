angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG
  ) {
  	$scope.backToindex = function(){
  	  window.location.href = CONFIG.LOGIN_PATH
  	}
  }
])