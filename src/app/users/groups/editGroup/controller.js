angular.module('App.Users.Groups.EditGroup').controller('App.Users.Groups.EditGroup.Controller', function(
  $scope,
  $modal,
  Notification,
  $state,
  Users,
  Group) {
  	
  $scope.id = $state.params.id
  	
  $scope.group = Group.getGroupById({id: $scope.id})
  
  $scope.group.$promise.then(function() {
    $scope.groupUser = $scope.group.users
    $scope.showGroupUser = $scope.group.users.map(function(user){
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

  $scope.removeu = function(row){
    $scope.showGroupUser.splice(row.rowIndex, 1);
    angular.forEach($scope.groupUser, function(user, index) {
      if(row.entity.user_id == user.user_id){
        $scope.groupUser.splice(index, 1);
      }
    })
  }

  $scope.addUsersWin = function(){ 
    var addUsersModal = $modal.open({
      templateUrl: 'src/app/users/groups/editGroup/add-users-window-modal.html',
      controller: addUsersModalController,
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

  var addUsersModalController = function($scope, $modalInstance, userList, groupUsers) {
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

  $scope.updateGroup = function(group){
    group.users = $scope.groupUser;
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
})