angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function(
  $scope,
  $modal,
  Notification,
  Users,
  Group) {

  //addUser window
  $scope.addUser = function() {
    var addUserModal = $modal.open({
      templateUrl: 'src/app/users/managedUsers/add-user-modal.html',
      windowClass: 'add-user-modal-view',
      backdrop: 'static',
      controller: addUserModalController,
      resolve: {
        groupList: function() {
          return Group.query()
        },
        userList: function() {
          return $scope.userList
        }
      }
    })
  }

  //addUser window ctrl
  var addUserModalController = function($scope, $modalInstance, groupList, userList) {
    $scope.userList = userList;

  	//增加window 用户默认值
  	$scope.user = {
      total_space : 5,
      space_unlimited :false,
      config:{
        show_member : true,
        desktop_sync : true,
        inner_share : false
      }
  	}
  	
    $scope.groupList = groupList;
    // 过滤后的数据
    $scope.shownData = [];
    // 选中的数据
    $scope.selectedData = [];
    $scope.gridGroup = {
      data: 'shownData',
      selectedItems: $scope.selectedData,
      // enableRowSelection : false,
      showSelectionCheckbox: true,
      selectWithCheckboxOnly: true,
      showSelectionCheckbox: true,
      afterSelectionChange: function(rows, checkAll) {
        if (!angular.isArray(rows)) {
          rows = [rows]
        }
        angular.forEach(rows, function(row) {
          if (angular.isUndefined(checkAll)) {
            row.entity.showRoleMenu = !row.entity.showRoleMenu;
          } else {
            row.entity.showRoleMenu = checkAll;
          }
        })
        // 重新计算选中的项
        $scope.selectedData = $($scope.groupList).filter(function(index, group) {
          return group.showRoleMenu;
        })
      },
      columnDefs: [{
        field: 'group_name',
        displayName: '群组名称'
      }, {
        field: 'user_count',
        displayName: '人数'
      }, {
        displayName: '组内权限',
        cellTemplate: 'src/app/users/managedUsers/row-group-role.html',
      }]
    }

    $scope.seachGroups = function(seachGroupsValue) {
      // 清空显示的group
      $scope.shownData = []
      // 重新计算
      $scope.shownData = $($scope.groupList).filter(function(index, group) {
        if (!seachGroupsValue || seachGroupsValue.trim() === '') {
          return true
        } else if (group.group_name.toLowerCase().indexOf(seachGroupsValue.toLowerCase()) != -1) {
          return true
        } else {
          return false
        }
      })
    }

    groupList.$promise.then(function() {
      angular.forEach(groupList, function(group) {
        group.showRoleMenu = false;
        group.role_id = 0;
        // 获取数据之后，全部填充到显示的数据中
        $scope.shownData.push(group);
      });

    });
    $scope.groupList = groupList;
    $scope.showAccountAdmin = false;

    $scope.switchAccountAdmin = function() {
      $scope.showAccountAdmin = !$scope.showAccountAdmin;
    };

    $scope.switchRoleMenu = function(group) {
      group.showRoleMenu = !group.showRoleMenu;
    };

    $scope.ok = function(user) {
      var groups = []
        // TODO 我觉得这里的逻辑完全是交互的问题，用户本来选了的，但是搜索的时候影藏了还要不要添加进去呢？
      angular.forEach(groupList, function(group) {
        if (group.showRoleMenu) {
          // or  if (group.showRoleMenu && gorup.show) {
          groups.push({
            group_id: group.group_id,
            role_id: group.role_id
          })
        }
      })
      user.groups = groups;
      Users.create({}, user).$promise.then(function(resUser) {
        $scope.userList.push(resUser)
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '添加用户成功',
          closeable: true
        })
        $modalInstance.close()
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }

  //userList data
  $scope.userList = Users.query()

  $scope.gridOptions = {
    data: 'userList',
    selectedItems: [],
    headerRowHeight: 36,
    rowHeight: 60,
    enableRowSelection: false,
    //      showSelectionCheckbox: true,
    columnDefs: [{
      displayName: '用户',
      cellTemplate: 'src/app/users/managedUsers/row-user-name.html',
      cellClass: 'grid-align'
    }, {
      field: 'email',
      displayName: '邮箱'
    }, {
      field: 'space',
      displayName: '用量'
    }, {
      cellTemplate: 'src/app/users/managedUsers/row-user-activety.html',
      displayName: '活动'
    }, {
      cellTemplate: 'src/app/users/managedUsers/user-table-action-cell.html',
      displayName: '更多'
    }]
  }

  //deleteUser
  $scope['delete'] = function(row) {
    console.log("Here I need to know which row was selected " + row.entity.user_id)
    var deleteUserModal = $modal.open({
      templateUrl: 'src/app/users/managedUsers/delete-user-modal.html',
      controller: deleteModalController,
      resolve: {
        userId: function() {
          return row.entity.user_id
        }
      }
    })

    deleteUserModal.result.then(function(userId) {
      Users['delete']({
        id: userId
      }).$promise.then(function() {
        for (var i = 0; i < $scope.userList.length; ++i) {
          if ($scope.userList[i].user_id == userId) break
        }
        $scope.userList.splice(i, 1)
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '删除用户成功',
          closeable: true
        })
      })
    })
  }

  //delete window ctrl
  var deleteModalController = function($scope, $modalInstance, userId) {
    $scope.ok = function() {
      $modalInstance.close(userId)
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }

  //editUser
  $scope.edit = function edit(row) {
  	$scope.editUser = row.entity;
    console.log("Here I need to know which row was selected " + row.entity.user_id)
//  var editUserModal = $modal.open({
//    templateUrl: 'src/app/users/managedUsers/update-user-modal.html',
//    controller: editModalController,
//    resolve: {
//      editUser: function() {
//        // Past the ref to the modal
//        return angular.copy(row.entity)
//      }
//    }
//  })

//  editUserModal.result.then(function(editUser) {
//    Users.update({
//      id: editUser.user_id
//    }, editUser).$promise.then(function() {
//      angular.extend(row.entity, editUser)
//      Notification.show({
//        title: '成功',
//        type: 'success',
//        msg: '修改用户成功',
//        closeable: true
//      })
//    }, function(error) {
//      Notification.show({
//        title: '失败',
//        type: 'danger',
//        msg: error.data.result,
//        closeable: true
//      })
//    })
//  })
  }

  //edit window ctrl
//var editModalController = function($scope, $modalInstance, editUser) {
//  $scope.editUser = editUser
//
//  $scope.ok = function() {
//    $modalInstance.close($scope.editUser)
//  }
//
//  $scope.cancel = function() {
//    $modalInstance.dismiss('cancel')
//  }
//}

  $scope.bulkEdit = function() {
    alert("bulkEdit")
  }

  $scope.bulkadd = function() {
    alert("bulkadd")
  }

  $scope.exportUser = function() {
    alert("exportUser")
  }

})