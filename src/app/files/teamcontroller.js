angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  'CONFIG',
  '$state',
  'Share',
  function(
    $scope,
    CONFIG,
    $state,
    Share
  ) {
  	var folderId = $state.params.folderId || 0;
  	
  	if(folderId == 0){
  		$scope.isRoot = true
  	}else{
  		$scope.isRoot = false
  	}
  	
  	if(folderId != 0){
  		$scope.shareObj = Share.queryShareObj({
  			id : folderId
  		})
  	
  		$scope.shareObj.$promise.then(function(shareObj){
  			$scope.users = shareObj.list
  		})
  	}
  	
  }
])