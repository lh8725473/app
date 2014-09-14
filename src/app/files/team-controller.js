angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  'CONFIG',
  '$state',
  'Folders',
  'Share',
  'Notification',
  '$modal',
  function(
    $scope,
    CONFIG,
    $state,
    Folders,
    Share,
    Notification,
    $modal
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
  	var folder_id = $state.params.folderId || 0;
  	
  	if(folder_id == 0){
  		$scope.isRoot = true
  	}else{
  		$scope.isRoot = false
  	}
  	
  	if(folder_id != 0){
  		$scope.shareObj = Folders.queryShareObj({
  			folder_id : folder_id
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
  				if(user.owner_uid == user.user_id){//拥有者
  				  user.permission_value = '拥有者'
  				}else{
        		angular.forEach($scope.permission_key, function(key, index) {
              if(key == user.permission){
                user.permission_value = $scope.permission_value[index]
              }                    
        		})	  
  				}
  			})
  		})
  	}
  	
  	//邀请协作成功后重新渲染
  	$scope.$on('inviteDone', function($event, $files) {
  	  if(folder_id != 0){  
    	  $scope.shareObj = Folders.queryShareObj({
          folder_id : folder_id
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
            if(user.owner_uid == user.user_id){//拥有者
              user.permission_value = '拥有者'
            }else{
              angular.forEach($scope.permission_key, function(key, index) {
                if(key == user.permission){
                  user.permission_value = $scope.permission_value[index]
                }                    
              })    
            }     
          })
        })
  	  }
  	})
  	
  	//群组是否展开查看用户
  	$scope.changeGroupshow = function(group){
  		group.show = !group.show
  	}
  	
  	//改变用户权限
  	$scope.changeUserPermission = function(user, permission_value){
  		user.isopen = !user.isopen;
  		angular.forEach($scope.permission_value, function(value, index) {
  			if(permission_value == value){
  				user.permission = $scope.permission_key[index]
  			}
  		})
  		Share.update({
  			id : folder_id
  		},{
  			user_id : user.user_id,
  			permission : user.permission,
  			obj_id : user.obj_id
  		}).$promise.then(function() {
  		  Notification.show({
          title: '成功',
          type: 'success',
          msg: '修改权限成功',
          closeable: true
        })
  		  user.permission_value = permission_value;
  		}, function (error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
        }
  		)
  	}
  	
  	//改变群组权限
  	$scope.changeGroupPermission = function(group, permission_value){
  	  group.isopen = !group.isopen;
  		angular.forEach($scope.permission_value, function(value, index) {
        if(permission_value == value){
          group.permission = $scope.permission_key[index]
        }
      })
      Folders.updateGroup({
        folder_id : folder_id
      },{
        group_id : group.group_id,
        permission : group.permission,
        obj_id : group.obj_id
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '修改权限成功',
          closeable: true
        })
        group.permission_value = permission_value;
      }, function (error) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            })
	        }
      )
  	}
  	
  	//移除用户协作
  	$scope.deleteUserShare = function(user){
      var deleteUserShareModal = $modal.open({
        templateUrl: 'src/app/files/delete-share-user-confim.html',
        windowClass: 'delete-share-user',
        backdrop: 'static',
        controller: deleteUserShareController,
        resolve: {
          user: function() {
            return user
          },
          users: function() {
            return $scope.users
          }
        }
      })
  	}

    // deleteUserShare file
    var deleteUserShareController = [
      '$scope',
      '$modalInstance',
      'user',
      'users',
      function(
        $scope,
        $modalInstance,
        user,
        users
      ) {
        $scope.users = users
        $scope.user = user

        $scope.ok = function() {
          Share.deleteShare({
            id : folder_id,
            user_id : $scope.user.user_id,
            obj_id : $scope.user.obj_id
          }).$promise.then(function(reFolder) {
            for (var i = 0; i < $scope.users.length; ++i) {
              if ($scope.users[i].user_id == $scope.user.user_id) {
                $scope.users.splice(i, 1)
                break
              }
            }
            Notification.show({
              title: '成功',
              type: 'success',
              msg: '删除协作成功',
              closeable: true
            })
            $modalInstance.close()
          }, function (error) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
              })
            }
          )
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

  	
  	//移除群组协作
  	$scope.deleteGroupShare = function(group){
      var deleteGroupShareModal = $modal.open({
        templateUrl: 'src/app/Files/delete-share-user-confim.html',
        windowClass: 'delete-share-user',
        backdrop: 'static',
        controller: deleteGroupShareController,
        resolve: {
          group: function() {
            return group
          },
          groups: function() {
            return $scope.groups
          }
        }
      })

/*
  		Folders.deleteGroup({
        folder_id : folder_id,
        group_id : group.group_id,
        obj_id : group.obj_id
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '删除协作成功',
          closeable: true
        }, function (error) {
	            Notification.show({
	                title: '失败',
	                type: 'danger',
	                msg: error.data.result,
	                closeable: false
	            })
	        }
        )
      }) */
  	}

    // deleteGroupShare file
    var deleteGroupShareController = [
      '$scope',
      '$modalInstance',
      'group',
      'groups',
      function(
        $scope,
        $modalInstance,
        group,
        groups
      ) {
        $scope.group = group
        $scope.groups = groups

        $scope.ok = function() {
          Folders.deleteGroup({
            folder_id : folder_id,
            group_id : $scope.group.group_id,
            obj_id : $scope.group.obj_id
          }).$promise.then(function(reFolder) {
            for (var i = 0; i < $scope.groups.length; ++i) {
              if ($scope.groups[i].group_id == $scope.group.group_id) {
                $scope.groups.splice(i, 1)
                break
              }
            }
            Notification.show({
              title: '成功',
              type: 'success',
              msg: '删除协作成功',
              closeable: true
            })
            $modalInstance.close()
          }, function (error) {
                Notification.show({
                    title: '失败',
                    type: 'danger',
                    msg: error.data.result,
                    closeable: false
                })
            }
          )
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    
    //邀请协作人
    $scope.inviteTeamUsers = function() {
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users/template.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: 'App.Files.InviteTeamUsersController',
        resolve: {
          folder_id: function() {
            return folder_id
          },
          folder_name: function() {
            return Folders.folderView({
              folder_id: folder_id
            }).$promise.then(function(folder) {
              return folder.folder_name
            })
          }
        }
      })
    }
  }
])