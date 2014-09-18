angular.module('App.Files').controller('App.Files.TeamController', [
  '$scope',
  '$rootScope',
  'CONFIG',
  '$state',
  '$stateParams',
  'Folders',
  'Share',
  'Notification',
  '$modal',
  '$cookies',
  function(
    $scope,
    $rootScope,
    CONFIG,
    $state,
    $stateParams,
    Folders,
    Share,
    Notification,
    $modal,
    $cookies
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
     	
  	//是否为根目录
    $scope.isRoot = (folder_id == 0) ? true : false
  	
  	//对当前目录下的权限
    var folder_permission = ''
    
  	if(folder_id != 0){
  		$scope.shareObj = Folders.queryShareObj({
  			folder_id : folder_id
  		})
  	
  		$scope.shareObj.$promise.then(function(shareObj){
  		  //对当前目录下的权限
        folder_permission = shareObj.permission
        var folder_owner = folder_permission.substring(0, 1)  //协同拥有者 or 拥有者1
        var folder_delete =  folder_permission.substring(1, 2)  //删除权限
        var folder_edit =  folder_permission.substring(2, 3)  //编辑权限
        var folder_getLink =  folder_permission.substring(3, 4)  //链接权限
        var folder_preview =  folder_permission.substring(4, 5)  //预览权限
        var folder_download =  folder_permission.substring(5, 6)  //下载权限
        var folder_upload =  folder_permission.substring(6, 7)  //上传权限
        //权限列表
        $scope.folder_owner = (folder_owner == '1') ? true : false
        $scope.folder_delete = (folder_delete == '1') ? true : false
        $scope.folder_edit = (folder_edit == '1') ? true : false
        $scope.folder_getLink = (folder_getLink == '1') ? true : false
        $scope.folder_preview = (folder_preview == '1') ? true : false
        $scope.folder_download = (folder_download == '1') ? true : false
        $scope.folder_upload = (folder_upload == '1') ? true : false
        
        $rootScope.$broadcast('folder_permission', folder_permission);
  		  	  
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
  				  user.is_owner = true
  				}else{
        		angular.forEach($scope.permission_key, function(key, index) {
              if(key == user.permission){
                user.permission_value = $scope.permission_value[index]
              }                    
        		})
  				  if(user.user_id == $cookies.userId){//不能操作自己用户
  				    user.is_owner = true
  				  }
  				  if(parseInt(folder_permission) < parseInt(user.permission)){//不能操作大于自身权限的用户
  				    user.is_owner = true
  				  }
  				}
  				
          if($scope.folder_owner){//不能给予别人比自己大的权限
            user.permission_value_list = ['协同拥有者','编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者']
          }else{
            user.permission_value_list = ['编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者']
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
              user.is_owner = true
            }else{
              if(user.user_id == $cookies.userId){//不能操作自己
                user.is_owner = true
              }
              if(parseInt(folder_permission) < parseInt(user.permission)){//不能操作大于自身权限的用户
                user.is_owner = true
              }
              angular.forEach($scope.permission_key, function(key, index) {
                if(key == user.permission){
                  user.permission_value = $scope.permission_value[index]
                }                    
              })    
            }
            
            if($scope.folder_owner){//不能给予别人比自己大的权限
              user.permission_value_list = ['协同拥有者','编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者']
            }else{
              user.permission_value_list = ['编辑者', '查看上传者', '预览上传者', '查看者', '预览者', '上传者']
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
        templateUrl: 'src/app/files/delete-share-user-confirm.html',
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
        templateUrl: 'src/app/files/delete-share-user-confirm.html',
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
          folder_permission: function() {
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