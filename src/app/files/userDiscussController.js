angular.module('App.Files').controller('App.Files.UserDiscussController', [
  '$scope',
  'CONFIG',
  'Share',
  'UserDiscuss',
  function(
    $scope,
    CONFIG,
    Share,
    UserDiscuss
  ) {
  	var discuss_file_id = $scope.discuss_file_id || 0;
  	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
  		obj_id : discuss_file_id
  	})

    $scope.scrollbarConfig = {
      autoResize: true,
      scrollTo: 'end'
    }

    $scope.$watch('discuss_file_id', function (new_file_id) {
      discuss_file_id = new_file_id
      $scope.userDiscussList = UserDiscuss.getUserDiscussList({
        obj_id : discuss_file_id
      })
    })
  	
  	$scope.discussContent = ''
  	$scope.discussCount = 0
  	$scope.discussButton = false
  	
  	$scope.createUserDiscuss = function(){
  		UserDiscuss.createUserDiscuss({
  			obj_id : discuss_file_id
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