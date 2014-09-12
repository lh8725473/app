angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$state',
  '$translatePartialLoader',
  'CONFIG',
  '$rootScope',
  function(
    $scope,
    $state,
    $translatePartialLoader,
    CONFIG,
    $rootScope
  ) {

  	$scope.backToindex = function(){
  	  window.location.href = 'index.html'
  	}
    
    //搜索内部用户
    function doSearch(searchInputValue) {
      $state.go('users.managedUsers', {
        k: searchInputValue
      })
    }
  	
  	$scope.searchByKeyDown = function($event, searchInputValue){
  		if ($event.which === 13) {
        doSearch(searchInputValue)
  		}
  	}
  	
  	$scope.searchByButton = doSearch
  }
])