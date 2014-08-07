angular.module('App.Users.ManagedUsers.EditUser').controller('App.Users.ManagedUsers.EditUser.Controller', function(
  $scope,
  $modal,
  Notification,
  $state,
  Users,
  Group) {
  	
  $scope.id = $state.params.id
  	
  $scope.user = Users.getUserById({id: $scope.id})
  
  $scope.user.$promise.then(function() {
    $scope.userGroup = $scope.user.group
    $scope.showUserGroup = $scope.user.group
    // if ($scope.user.config.desktop_sync == 'true') {
    //   $scope.user.config.desktop_sync = true
    // };
  })
 	
	$scope.gridGroup = {
      data: 'showUserGroup',
      selectedItems: $scope.selectedData,
      enableRowSelection : false,
      columnDefs: [{
        displayName: '群组名称',
        cellTemplate : 'src/app/users/managedUsers/editUser/row-groups-name.html'    
      }, {
        field: 'user_count',
        displayName: '人数'
      }, {
        displayName: '组内权限',
        cellTemplate : 'src/app/users/managedUsers/editUser/row-group-role.html'
      }, {
        displayName: '管理',
        cellTemplate : 'src/app/users/managedUsers/editUser/row-groups-remove.html'
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

  $scope.removeg = function(row){
    $scope.showUserGroup.splice(row.rowIndex, 1);
    angular.forEach($scope.userGroup, function(group, index) {
      if(row.entity.group_id == group.group_id){
        $scope.userGroup.splice(index, 1);
      }
    })
  }

  $scope.addGroupsWin = function(){ 
    var addGroupsModal = $modal.open({
      templateUrl: 'src/app/users/managedUsers/editUser/add-groups-window-modal.html',
      controller: addUserModalController,
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
        $scope.userGroup.push(addGroup)
        $scope.showUserGroup.push(addGroup)
      })
    })
  }

  var addUserModalController = function($scope, $modalInstance, groupList, userGroups) {
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
    })
  
    $scope.selectedData = [];
    
    $scope.selectedMemberGridOptions = {
      data : 'groupListData',
      selectedItems : $scope.selectedData,
      showSelectionCheckbox: true,
      selectWithCheckboxOnly: true,
      columnDefs : [{
      	  displayName: '群组名称',
          cellTemplate: 'src/app/users/managedUsers/editUser/row-groups-name.html'
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

  $scope.updateUser = function(user){
    user.group = $scope.userGroup;
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
})