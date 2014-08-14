angular.module('App.Users.Groups.EditGroup').controller('App.Users.Groups.EditGroup.Controller', [
  '$scope',
  '$modal',
  'Notification',
  '$state',
  'Users',
  'Group',
  'CONFIG',
  'Share',
  function(
    $scope,
    $modal,
    Notification,
    $state,
    Users,
    Group,
    CONFIG,
    Share
  ) {
    
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
    
    $scope.id = $state.params.id
      
    $scope.group = Group.getGroupById({id: $scope.id})
    
    $scope.group.$promise.then(function() {
      $scope.groupUser = $scope.group.users
      $scope.showGroupUser = $scope.group.users.map(function(user){
        return user
      })
      $scope.groupFolder = $scope.group.folders
      $scope.showGroupFolder = $scope.group.folders.map(function(user){
        return user
      })
    })
    
    $scope.gridUser = {
        data: 'showGroupUser',
        selectedItems: $scope.selectedData,
        enableRowSelection : false,
        columnDefs: [{
          displayName: '用户',
          cellTemplate : 'src/app/users/groups/editGroup/row-users-name.html'    
        }, {
          field: 'email',
          displayName: '邮件'
        }, {
          displayName: '组内权限',
          cellTemplate : 'src/app/users/groups/editGroup/row-users-role.html'
        }, {
          displayName: '管理',
          cellTemplate : 'src/app/users/groups/editGroup/row-users-remove.html'
        }]
    }
    
    $scope.gridFolder = {
      data: 'showGroupFolder',
      enableRowSelection : false,
      columnDefs: [{
        field: 'folder_name',
        displayName: '文件夹名' 
      }, {
        field: 'folder_name',
        displayName: '拥有者'
      }, {
        field: 'folder_name',
        displayName: '文件数量'
      }, {
        displayName: '权限',
        cellTemplate : 'src/app/users/groups/editGroup/row-folders-permission.html'
      }, {
        displayName: '操作',
        cellTemplate : 'src/app/users/groups/editGroup/row-folders-remove.html'
      }]
    }

    $scope.seachUsers= function(seachUsersValue) {
        // 清空显示的group
        $scope.showUserGroup = []
        // 重新计算
        $scope.showGroupUser = $($scope.groupUser).filter(function(index, user) {
          if (!seachUsersValue || seachUsersValue.trim() === '') {
            return true
          } else if (user.real_name.toLowerCase().indexOf(seachUsersValue.toLowerCase()) != -1) {
            return true
          } else {
            return false
          }
        })
      }
	
	$scope.seachFolders = function(seachFoldersValue) {
      // 清空显示的Folder
      $scope.showUserFolder = []
      // 重新计算
      $scope.showUserFolder = $($scope.userFolder).filter(function(index, folder) {
        if (!seachFoldersValue || seachFoldersValue.trim() === '') {
          return true
        } else if (folder.folder_name.toLowerCase().indexOf(seachFoldersValue.toLowerCase()) != -1) {
          return true
        } else {
          return false
        }
      })
    } 
	
    $scope.removeu = function(row){
      $scope.showGroupUser.splice(row.rowIndex, 1);
      angular.forEach($scope.groupUser, function(user, index) {
        if(row.entity.user_id == user.user_id){
          $scope.groupUser.splice(index, 1);
        }
      })
    }
    
    $scope.removeFolder = function(row){
      $scope.showUserFolder.splice(row.rowIndex, 1);
        angular.forEach($scope.userFolder, function(folder, index) {
          if(row.entity.id == folder.id){
            $scope.userFolder.splice(index, 1);
          }
      })
    }

    $scope.addUsersWin = function(){ 
      var addUsersModal = $modal.open({
        templateUrl: 'src/app/users/groups/editGroup/add-users-window-modal.html',
        controller: addUsersModalController,
        backdrop: 'static',
        resolve: {
          userList: function() {
            // Past the ref to the modal
            return Users.query()
          },
          groupUsers: function() {
            // Past the ref to the modal
            return $scope.groupUser
          }
        }
      })
      
      addUsersModal.result.then(function(selectedData) {
        angular.forEach(selectedData, function(addUser) {
          addUser.role_id = 0;
          $scope.groupUser.push(addUser)
          // TODO 需要根据seachGroups中的seachGroupsValue测试addGroup是否在里面
          $scope.showGroupUser.push(addUser)
        })
      })
    }
    
    $scope.addFolderWin = function(){ 
      var addFoldersModal = $modal.open({
        templateUrl: 'src/app/users/managedUsers/editUser/add-folders-window-modal.html',
        controller: addFoldersModalController,
        backdrop: 'static',
        resolve: {
          folderList: function() {
            // Past the ref to the modal
            return Share.query()
          },
          groupFolders: function() {
            // Past the ref to the modal
            return $scope.groupFolder
          }
        }
      })
      
      addFoldersModal.result.then(function(selectedData) {
        angular.forEach(selectedData, function(addFolder) {
          addFolder.permission = '0001110';
          $scope.groupFolder.push(addFolder)
          // TODO 需要根据seachGroups中的seachGroupsValue测试addGroup是否在里面
          $scope.showGroupFolder.push(addFolder)
        })
      })
    }
    
    var addFoldersModalController = [
      '$scope',
      '$modalInstance',
      'folderList',
      'groupFolders',
      function(
        $scope,
        $modalInstance,
        folderList,
        groupFolders
      ) {
        $scope.folderListData = [];
        folderList.$promise.then(function() {
          angular.forEach(folderList, function(folder) {
            var addFlag = true;
            for (var i = 0;i < groupFolders.length; i++) {
              if(folder.id == groupFolders[i].id){
                addFlag = false;
              }
            }
            if(addFlag){
              $scope.folderListData.push(folder)
            }
          })
        })
      
        $scope.selectedData = [];
        
        $scope.selectedFolderGridOptions = {
          data : 'folderListData',
          selectedItems : $scope.selectedData,
          showSelectionCheckbox: true,
          selectWithCheckboxOnly: true,
          columnDefs : [{
              displayName: '文件夹名',
              cellTemplate: 'src/app/users/managedUsers/editUser/row-folders-name.html'
            }, {
              field: 'real_name',
              displayName: '所有者'
            }, {
              displayName: '文件数量',
              cellTemplate: 'src/app/users/managedUsers/editUser/row-folders-count.html'
            }]
        }
        $scope.ok = function() {
          $modalInstance.close($scope.selectedData)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    var addUsersModalController = [
      '$scope',
      '$modalInstance',
      'userList',
      'groupUsers',
      function(
        $scope,
        $modalInstance,
        userList,
        groupUsers
      ) {
        $scope.userListData = [];
        userList.$promise.then(function() {
          angular.forEach(userList, function(user) {
            var addFlag = true;
            for (var i = 0;i < groupUsers.length; i++) {
              if(user.user_id == groupUsers[i].user_id){
                addFlag = false;
              }
            }
            if(addFlag){
              $scope.userListData.push(user)
            }
          })
        })
      
        $scope.selectedData = [];
        
        $scope.selectedMemberGridOptions = {
          data : 'userListData',
          selectedItems : $scope.selectedData,
          showSelectionCheckbox: true,
          selectWithCheckboxOnly: true,
          columnDefs : [{
              displayName: '成员',
              cellTemplate: 'src/app/users/groups/editGroup/row-users-name.html'
            }, {
              field: 'email',
              displayName: '邮件'
            }]
        }

        $scope.ok = function() {
          $modalInstance.close($scope.selectedData)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    $scope.updateGroup = function(group){
      Group.update({
        id: group.group_id
      }, group).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '修改群组成功',
          closeable: true
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: true
        })
     })
    }
  }
])