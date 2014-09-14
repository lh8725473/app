angular.module('App.Users.ManagedUsers.EditUser').controller('App.Users.ManagedUsers.EditUser.Controller', [
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
    	
    $scope.user = Users.getUserById({id: $scope.id})
    
    $scope.coAdmin = true;

    $scope.user.$promise.then(function() {
      if($scope.user.config.co_admin == undefined){
        $scope.coAdmin = false
      }
      $scope.userGroup = $scope.user.groups
      $scope.showUserGroup = $scope.user.groups.map(function(group){
        return group
      })
      $scope.userFolder = $scope.user.folders
      $scope.showUserFolder = $scope.user.folders.map(function(folder){
        return folder
      })
    })
   	
  	$scope.gridGroup = {
        data: 'showUserGroup',
        enableRowSelection : false,
        columnDefs: [{
          displayName: '群组名称',
          cellTemplate : 'src/admin/users/managedUsers/editUser/row-groups-name.html'    
        }, {
          field: 'user_count',
          displayName: '人数'
        }, {
          displayName: '组内权限',
          cellTemplate : 'src/admin/users/managedUsers/editUser/row-group-role.html'
        }, {
          displayName: '管理',
          cellTemplate : 'src/admin/users/managedUsers/editUser/row-groups-remove.html'
        }]
    }

    $scope.gridFolder = {
      data: 'showUserFolder',
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
        cellTemplate : 'src/admin/users/managedUsers/editUser/row-folders-permission.html'
      }, {
        displayName: '操作',
        cellTemplate : 'src/admin/users/managedUsers/editUser/row-folders-remove.html'
      }]
    }

    $scope.seachGroups = function(seachGroupsValue) {
        // 清空显示的group
        $scope.showUserGroup = []
        // 重新计算
        $scope.showUserGroup = $($scope.userGroup).filter(function(index, group) {
          if (!seachGroupsValue || seachGroupsValue.trim() === '') {
            return true
          } else if (group.group_name.toLowerCase().indexOf(seachGroupsValue.toLowerCase()) != -1) {
            return true
          } else {
            return false
          }
        })
    }

    $scope.seachFolders = function(seachFoldersValue) {
      // 清空显示的group
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

    $scope.removeg = function(row){
      $scope.showUserGroup.splice(row.rowIndex, 1);
      angular.forEach($scope.userGroup, function(group, index) {
        if(row.entity.group_id == group.group_id){
          $scope.userGroup.splice(index, 1);
        }
      })
    }

    $scope.removeFolder = function(row){
      $scope.showUserFolder.splice(row.rowIndex, 1);
        angular.forEach($scope.userFolder, function(folder, index) {
          if(row.entity.folder_id == folder.folder_id){
            $scope.userFolder.splice(index, 1);
          }
      })
    }

    $scope.addGroupsWin = function(){ 
      var addGroupsModal = $modal.open({
        templateUrl: 'src/admin/users/managedUsers/editUser/add-groups-window-modal.html',
        controller: addGroupsModalController,
        backdrop: 'static',
        resolve: {
          groupList: function() {
            // Past the ref to the modal
            return Group.query()
          },
          userGroups: function() {
            // Past the ref to the modal
            return $scope.userGroup
          }
        }
      })
      
      addGroupsModal.result.then(function(selectedData) {
        angular.forEach(selectedData, function(addGroup) {
          addGroup.role_id = 0;
          $scope.userGroup.push(addGroup)
          // TODO 需要根据seachGroups中的seachGroupsValue测试addGroup是否在里面
          $scope.showUserGroup.push(addGroup)
        })
      })
    }

    var addGroupsModalController = [
      '$scope',
      '$modalInstance',
      'groupList',
      'userGroups',
      function(
        $scope,
        $modalInstance,
        groupList,
        userGroups
      ) {
        $scope.groupListData = [];
        groupList.$promise.then(function() {
        	angular.forEach(groupList, function(group) {
            var addFlag = true;
            for (var i = 0;i < userGroups.length; i++) {
              if(group.group_id == userGroups[i].group_id){
                addFlag = false;
              }
            }
            if(addFlag){
              $scope.groupListData.push(group)
            }
          })
        }, function (error) {
	            Notification.show({
	                title: '失败',
	                type: 'danger',
	                msg: error.data.result,
	                closeable: false
	            })
	        }
        )
      
        $scope.selectedData = [];
        
        $scope.selectedGroupGridOptions = {
          data : 'groupListData',
          selectedItems : $scope.selectedData,
          showSelectionCheckbox: true,
          selectWithCheckboxOnly: true,
          columnDefs : [{
          	  displayName: '群组名称',
              cellTemplate: 'src/admin/users/managedUsers/editUser/row-groups-name.html'
            }, {
              field: 'user_count',
          	  displayName: '群组人数',
              cellClass: 'gruop-add-email-row'
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

    $scope.addFolderWin = function(){ 
      var addFoldersModal = $modal.open({
        templateUrl: 'src/admin/users/managedUsers/editUser/add-folders-window-modal.html',
        controller: addFoldersModalController,
        backdrop: 'static',
        resolve: {
          folderList: function() {
            // Past the ref to the modal
            return Share.query()
          },
          userFolders: function() {
            // Past the ref to the modal
            return $scope.userFolder
          }
        }
      })
      
      addFoldersModal.result.then(function(selectedData) {
        angular.forEach(selectedData, function(folder) {
          folder.permission = "0001110";
          $scope.userFolder.push(folder)
          // TODO 需要根据seachGroups中的seachGroupsValue测试addGroup是否在里面
          $scope.showUserFolder.push(folder)
        })
      })
    }

    var addFoldersModalController = [
      '$scope',
      '$modalInstance',
      'folderList',
      'userFolders',
      function(
        $scope,
        $modalInstance,
        folderList,
        userFolders
      ) {
        $scope.folderListData = [];
        folderList.$promise.then(function() {
          angular.forEach(folderList, function(folder) {
            var addFlag = true;
            for (var i = 0;i < userFolders.length; i++) {
              if(folder.folder_id == userFolders[i].folder_id){
                addFlag = false;
              }
            }
            if(addFlag){
              $scope.folderListData.push(folder)
            }
          })
        }, function (error) {
              Notification.show({
                  title: '失败',
                  type: 'danger',
                  msg: error.data.result,
                  closeable: false
              })
          }
        )
      
        $scope.selectedData = [];
        
        $scope.selectedFolderGridOptions = {
          data : 'folderListData',
          selectedItems : $scope.selectedData,
          showSelectionCheckbox: true,
//        selectWithCheckboxOnly: true,
          checkboxCellTemplate : '<div class="ngSelectionCell"><input tabindex="-1" class="ngSelectionCheckbox aaa" type="checkbox" ng-checked="row.selected" /></div>',
          columnDefs : [{
              displayName: '文件夹名',
              cellTemplate: 'src/admin/users/managedUsers/editUser/row-folders-name.html'
            }, {
              field: 'real_name',
              displayName: '所有者'
            }, {
              displayName: '文件数量',
              cellTemplate: 'src/admin/users/managedUsers/editUser/row-folders-count.html'
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

    $scope.updateUser = function(user){
      user.groups = $scope.userGroup;
      Users.update({
        id: user.user_id
      }, user).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '修改用户成功',
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