angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  '$rootScope',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    $rootScope
  ) {
  	$scope.backToindex = function(){
  	  window.location.href = "index.html"
  	}
  	
  	$scope.searchByKeyDown = function($event,seachInputValue){
  		if ($event.which === 13) {
  			$rootScope.seachInputValue = seachInputValue
  			window.location.href = "admin.html#/users/managedUsers"
  		}
  	}
  	
  	$scope.searchByButton = function(seachInputValue){
  		$rootScope.seachInputValue = seachInputValue
  		window.location.href = "admin.html#/users/managedUsers"
  	}
  }
])