angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies
  ) {
  	$scope.backToindex = function(){
  	  window.location.href = CONFIG.LOGIN_PATH
  	}
  	
  	$scope.id = $cookies.userId
    	
    $scope.user = Users.getUserById({id: $scope.id})
  }
])