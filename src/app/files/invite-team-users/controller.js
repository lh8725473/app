angular.module('App.Files').controller('App.Files.InviteTeamUsersController', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'Cloud',
  'folder_id',
  'folder_permission',
  'folder_name',
  'CONFIG',
  '$timeout',
  'Share',
  'Notification',
  function(
    $scope,
    $rootScope,
    $modalInstance,
    Cloud,
    folder_id,
    folder_permission,
    folder_name,
    CONFIG,
    $timeout,
    Share,
    Notification
  ) {
      $scope.broad = false
      //分享文件夹ID
      $scope.folder_id = folder_id
      //分享文件夹名字
      $scope.folder_name = folder_name
      //权限
      $scope.permission_key = CONFIG.PERMISSION_KEY
      $scope.permission_value = CONFIG.PERMISSION_VALUE

      $scope.permissions = []
      angular.forEach($scope.permission_key, function(key, index) {
        var permissionMap = {
          key: key,
          value: $scope.permission_value[index]
         }
        $scope.permissions.push(permissionMap)
      })

      $scope.selectedPermissionKey = "0111111"
      $scope.selectedPermissionValue = "编辑者"

      //选择权限dropdown
      $scope.permissionOpen = false

      //选择权限
      $scope.selectedPermission = function(value) {
        $scope.selectedPermissionValue = value
        $scope.permissionOpen = !$scope.permissionOpen
        angular.forEach($scope.permission_value, function(p_value, index) {
          if (p_value == value) {
            $scope.selectedPermissionKey = $scope.permission_key[index]
          }
        })
      }

      //删除选中的人员
      $scope.deleteSelectedUser = function(user) {
        for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
          if ((user.user_id && $scope.invitedList.userList[i].user_id == user.user_id) || (user.email && $scope.invitedList.userList[i].email == user.email)){
            user.selected = false
            break
          }
        }
        $scope.invitedList.userList.splice(i, 1)
        
        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //删除选中的组
      $scope.deleteSelectedGroup = function(group) {
        for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
          if ($scope.invitedList.groupList[i].group_id == group.group_id){
            group.selected = false
            break
          }
        }
        $scope.invitedList.groupList.splice(i, 1)
        
        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //协作 人员和组的接口
      $scope.cloudUserList = Cloud.cloudUserList({
        folder_id: $scope.folder_id
      })

      $scope.cloudUserList.$promise.then(function(cloudUser) {
        $scope.userList = cloudUser.list.users
        $scope.groupList = cloudUser.list.groups

        angular.forEach($scope.userList, function(user) {
          user.selected = false
        })

        angular.forEach($scope.groupList, function(group) {
          group.show = false
          group.selected = false
        })
      })

      //组是否显示人员
      $scope.changeGroupshow = function(group) {
        group.show = !group.show
      }

      //已邀请的 组和人员
      $scope.invitedList = {
        groupList: [],
        userList: []
      }

      //外部联系人输入框
      $scope.inviteInputValue = ""

      //输入框输入增加协作人或组
      $scope.inviteBypress = function(inviteInputValue) {
        var user = {
          real_name: inviteInputValue,
          email: inviteInputValue
        }
        $scope.invitedList.userList.push(user)
        $scope.inviteInputValue = ''
        
        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }else {
          $scope.disableBtn = true;
        }
      }

      //右侧列表是否显示
      $scope.showGRroupUser = function() {
        $scope.broad = !$scope.broad
      }

      //右侧列表选择协作人或组
      $scope.disableBtn = true;
      $scope.inviteBySelect = function(groupOrUser, selected) {
        if (selected) { //取消组或者协作人
          if (groupOrUser.group_id) { //取消的是组
            angular.forEach($scope.groupList, function(group) {
              if (groupOrUser.group_id == group.group_id) {
                group.selected = false;
              }
            })
            for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
              if ($scope.invitedList.groupList[i].group_id == groupOrUser.group_id)
                break
            }
            $scope.invitedList.groupList.splice(i, 1)
          } else { //取消的是用户
            angular.forEach($scope.userList, function(user) {
              if (groupOrUser.user_id == user.user_id) {
                user.selected = false;
              }
            })
            for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
              if ($scope.invitedList.userList[i].user_id == groupOrUser.user_id)
                break
            }
            $scope.invitedList.userList.splice(i, 1)
          }
        } else { //选中列表中组或者协作人
          if (groupOrUser.group_id) { //选中的是组
            $scope.invitedList.groupList.push(groupOrUser)
          } else { //选中的是用户
            $scope.invitedList.userList.push(groupOrUser)
          }
        }
        
        if ($scope.invitedList.userList.length > 0 || $scope.invitedList.groupList.length > 0) {
          $scope.disableBtn = false;
        }
        else {
          $scope.disableBtn = true;
        }
      }

      //邀请联系人comment
      $scope.comment = "你好，我想在全协通中与你分享文件夹"

      //发送邀请
      $scope.createShare = function() {
        var toUserList = []
        var toGroupList = []
        angular.forEach($scope.invitedList.userList, function(user) {
          if (user.user_id) { //已有联系人
            var to_user = {
              to_user_id: user.user_id
            }
            toUserList.push(to_user)
          } else { //没有的联系人 （通过邮件邀请）
            var to_user = {
              email: user.email
            }
            toUserList.push(to_user)
          }
        })
        angular.forEach($scope.invitedList.groupList, function(group) {
          var to_group = {
            to_group_id: group.group_id
          }
          toGroupList.push(to_group)
        })
        Share.createShare({}, {
          share_type: "to_all",
          permission: $scope.selectedPermissionKey,
          obj_type: "folder",
          comment: $scope.comment,
          obj_id: $scope.folder_id,
          list: {
            users: toUserList,
            groups: toGroupList
          }
        }).$promise.then(function(resUser) {
          $modalInstance.close()
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '邀请成功',
            closeable: true
          })
          $rootScope.$broadcast('inviteDone');
        }, function (error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
        })
      }

      $scope.ok = function() {
        console.log(currentNode)
        $modalInstance.close(folder_id)
      }

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
      }
  }
])