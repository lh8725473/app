angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  'CONFIG',
  '$state',
  'Folders',
  'Share',
  function(
    $scope,
    CONFIG,
    $state,
    Folders,
    Share
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
  	
  	//当前所在文件夹目录
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
  	
  	//群组是否展开查看用户
  	$scope.changeGroupshow = function(group){
  		group.show = !group.show
  	}
  	
  	//改变用户权限
  	$scope.changeUserPermission = function(user, permission_value){
  		user.isopen = !user.isopen;
  		user.permission_value = permission_value;
  		angular.forEach($scope.permission_value, function(value, index) {
  			if(user.permission_value == value){
  				user.permission = $scope.permission_key[index]
  			}
  		})
  		Share.update({
  			id : folderId
  		},{
  			user_id : user.user_id,
  			permission : user.permission,
  			obj_id : user.obj_id
  		})
  	}
  	
  	//改变群组权限
  	$scope.changeGroupPermission = function(group, permission_value){
  		
  	}
  	
  	//移除用户分享
  	$scope.deleteUserShare = function(user){
  		Share.deleteShare({
  			id : folderId,
  			user_id : user.user_id,
  			obj_id : user.obj_id
  		})
  	}
  	
  	//改变群组权限
  	$scope.deleteGroupShare = function(group){
  		
  	}
  }
])