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
  	$scope.discussCount = 0
  	$scope.discussButton = false
  	
  	$scope.createUserDiscuss = function(){
  		UserDiscuss.createUserDiscuss({
  			obj_id : file_id
  		},{
  			content	:$scope.discussContent
  		}).$promise.then(function(userDiscuss){
  			$scope.discussContent = ''
  			$scope.discussCount = 0
  			$scope.userDiscussList.push(userDiscuss)
  		})
  	}
  	
  	$scope.changeDiscussInput = function(discussContent){
  		$scope.discussCount = discussContent.length
  		if(discussContent.length>200){
  			$scope.discussButton = true
  		}else{
  			$scope.discussButton = false
  		}
  	}
  	
  }
])