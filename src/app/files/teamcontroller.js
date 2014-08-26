angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  'CONFIG',
  '$state',
  'Folders',
  function(
    $scope,
    CONFIG,
    $state,
    Folders
  ) {
  	//权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    $scope.permissions = []
    angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key : key,
        value : $scope.permission_value[index]
      }
      $scope.permissions.push(permissionMap)
    })
  	
  	
  	var folderId = $state.params.folderId || 0;
  	
  	if(folderId == 0){
  		$scope.isRoot = true
  	}else{
  		$scope.isRoot = false
  	}
  	
  	if(folderId != 0){
  		$scope.shareObj = Folders.queryShareObj({
  			folder_id : folderId
  		})
  	
  		$scope.shareObj.$promise.then(function(shareObj){
  			$scope.users = shareObj.list.users
  			$scope.groups = shareObj.list.groups
  			angular.forEach($scope.groups, function(group){
  				group.show = false
  				//群组权限
        		angular.forEach($scope.permission_key, function(key, index) {
          			if(key == group.permission){
            			group.permission_value = $scope.permission_value[index]
          			}
        		})			
  			})
  			angular.forEach($scope.users, function(user){
  				//人员权限
        		angular.forEach($scope.permission_key, function(key, index) {
          			if(key == user.permission){
            			user.permission_value = $scope.permission_value[index]
          			}
        		})			
  			})
  		})
  	}
  	
  	$scope.changeGroupshow = function(group){
  		group.show = !group.show
  	}
  	
  	$scope.changePermission = function(user, permission_value){
  		user.isopen = !user.isopen;
  		user.permission_value = permission_value;
  		angular.forEach($scope.permission_value, function(value, index) {
  			if(permission_value = value){
  				
  			}
  		})
  	}
  }
])