angular.module('App.Files').controller('App.Files.UserDisscussController', [
  '$scope',
  'CONFIG',
  '$state',
  'Share',
  'UserDiscuss',
  function(
    $scope,
    CONFIG,
    $state,
    Share,
    UserDiscuss
  ) {
  	var file_id = $state.params.file_id || 0;
  	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
  		obj_id : file_id
  	})
  	
  	$scope.discussContent = ''
  	
  	$scope.createUserDiscuss = function(){
  		UserDiscuss.createUserDiscuss({
  			obj_id : file_id
  		},{
  			content	:discussContent
  		}).$promise.then(function(userDiscuss){
  			$scope.discussContent = ''
  			$scope.userDiscussList.push(userDiscuss)
  		})
  	}
  	
  }
])