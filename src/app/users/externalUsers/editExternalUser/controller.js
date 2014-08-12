angular.module('App.Users.ExternalUsers.EditExternalUser').controller('App.Users.ExternalUsers.EditExternalUser.Controller', [
  '$scope',
  '$modal',
  'Notification',
  '$state',
  'Users',
  'Group',
  'ExternalUser', 
  function(
  	$scope,
  	$modal,
  	Notification,
  	$state,
  	Users,
  	Group,
  	ExternalUser) {
  	
  	$scope.id = $state.params.id
  	
  	$scope.externalUser = ExternalUser.getExternalUserById({id: $scope.id})
  
    $scope.externalUser.$promise.then(function() {
      $scope.externalUserFolder = $scope.externalUser.folder
      $scope.showUserExternalUserFolder = $scope.externalUser.folder.map(function(folder){
        return folder
      })
    })
 	
	 $scope.gridFolder = {
    data: 'showUserExternalUserFolder',
    selectedItems: $scope.selectedData,
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
      cellTemplate : 'src/app/users/externalUsers/editExternalUser/row-externalUser-role.html'
    }, {
      displayName: '操作',
      cellTemplate : 'src/app/users/externalUsers/editExternalUser/row-externalUser-remove.html'
    }]
  }

    $scope.removeExternalUser = function(row){
      $scope.showUserExternalUserFolder.splice(row.rowIndex, 1);
        angular.forEach($scope.externalUserFolder, function(folder, index) {
          if(row.entity.id == folder.id){
            $scope.externalUserFolder.splice(index, 1);
          }
      })
    }

    $scope.seachFolders = function(seachFoldersValue) {
      // 清空显示的group
      $scope.showUserExternalUserFolder = []
      // 重新计算
      $scope.showUserExternalUserFolder = $($scope.externalUserFolder).filter(function(index, folder) {
        if (!seachFoldersValue || seachFoldersValue.trim() === '') {
          return true
        } else if (folder.folder_name.toLowerCase().indexOf(seachFoldersValue.toLowerCase()) != -1) {
          return true
        } else {
          return false
        }
      })
    }

    $scope.updateExternalUser = function(externalUser){
      externalUser.groups = $scope.userGroup;
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