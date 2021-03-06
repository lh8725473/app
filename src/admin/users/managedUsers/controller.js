angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', [
  '$scope',
  '$modal',
  '$stateParams',
  'Notification',
  'Users',
  'Group',
  '$cookies',
  'CONFIG',
  '$rootScope',
  function(
    $scope,
    $modal,
    $stateParams,
    Notification,
    Users,
    Group,
    $cookies,
    CONFIG,
    $rootScope
  ) {
    
    //加载动画
    $scope.loading = true
    //addUser window
    $scope.addUser = function() {
      var addUserModal = $modal.open({
        templateUrl: 'src/admin/users/managedUsers/add-user-modal.html',
        windowClass: 'add-user-modal-view',
        backdrop: 'static',
        controller: addUserModalController,
        resolve: {
          userList: function() {
            return $scope.userList
          }
        }
      })
    }

    //addUser window ctrl
    var addUserModalController = [
      '$scope',
      '$modalInstance',
      'userList',
      function(
        $scope,
        $modalInstance,
        userList
      ) {                                     
        $scope.userList = userList;

      	//增加userwindow 用户默认值
      	$scope.user = {
          total_space : 5,
          space_unlimited :false,
          config:{
            show_member : true,
            desktop_sync : true,
            inner_share : false
          },
          groups:[]
      	}

        $scope.addGroupWindow = function() {
          var addGroupModal = $modal.open({
            templateUrl: 'src/admin/users/managedUsers/add-group-window-modal.html',
            windowClass: 'add-group-modal-view',
            backdrop: 'static',
            controller: addGroupModalController,
            resolve: {
              groupList: function() {
                return Group.query()
              },
              addgroups: function() {
                return $scope.user.groups
              }
            }
          })

          addGroupModal.result.then(function(selectedData) {
            angular.forEach(selectedData, function(group){
            	$scope.user.groups.push(group)
            })
          })
        }

        var addGroupModalController = [
          '$scope',
          '$modalInstance',
          'groupList',
          'addgroups',
          function(
            $scope,
            $modalInstance,
            groupList,
            addgroups
          ){
            $scope.groupListData = []
            groupList.$promise.then(function() { 
              angular.forEach(groupList, function(group) {
                var addFlag = true;
                for (var i = 0;i < addgroups.length; i++) {
                  if(group.group_id == addgroups[i].group_id){
                    addFlag = false;
                  }
                }
                if(addFlag){
                  group.role_id = 0
                  $scope.groupListData.push(group)
                }
              })
            })

            $scope.shownData = $scope.groupListData
			
			      $scope.seachGroups = function(seachGroupsValue) {
              // 清空显示的group
              $scope.shownData = []
              // 重新计算
              $scope.shownData = $($scope.groupListData).filter(function(index, group) {
                if (!seachGroupsValue || seachGroupsValue.trim() === '') {
                  return true
                } else if (group.group_name.toLowerCase().indexOf(seachGroupsValue.toLowerCase()) != -1) {
                  return true
                } else {
                  return false
                }
              })
            }
			
            $scope.selectedData = []
            $scope.selectedGroupGridOptions = {
              data: 'shownData',
              selectedItems: $scope.selectedData,
              showSelectionCheckbox: true,
              selectWithCheckboxOnly: true,
              columnDefs: [{
                field: 'group_name',
                displayName: '群组名称'
              }, {
                field: 'user_count',
                displayName: '人数'
              }, {
                displayName: '组内权限',
                cellTemplate: 'src/admin/users/managedUsers/row-group-role.html',
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
      	
        // 过滤后的数据
        $scope.shownData = [];
        
        $scope.gridAddGroup = {
          data: 'user.groups',
          selectedItems: $scope.selectedData,
          enableRowSelection : false,
          columnDefs: [{
            field: 'group_name',
            displayName: '群组名称'
          }, {
            field: 'user_count',
            displayName: '人数'
          }, {
            displayName: '组内权限',
            cellTemplate: 'src/admin/users/managedUsers/row-group-role.html',
          }]
        }

        $scope.switchRoleMenu = function(group) {
          group.showRoleMenu = !group.showRoleMenu;
        };

        $scope.ok = function(user) {
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
    ]

    //userList data
    if ($stateParams.k) {
      $scope.userList = Users.query({
        keyword: $stateParams.k
      }) 
      $scope.userList.$promise.then(function() {
        $scope.loading = false
      })

    } else {
      $scope.userList = Users.query()     
      $scope.userList.$promise.then(function() {
        $scope.loading = false
      })
    }

    $scope.gridOptions = {
      data: 'userList',
      selectedItems: [],
      headerRowHeight: 36,
      rowHeight: 60,
      enableRowSelection: false,
      //      showSelectionCheckbox: true,
      columnDefs: [{
        displayName: '用户',
        cellTemplate: 'src/admin/users/managedUsers/row-user-name.html',
        cellClass: 'grid-align'
      }, {
        field: 'email',
        displayName: '邮箱'
      }, {
        field: 'space',
        displayName: '用量'
      }, {
        cellTemplate: 'src/admin/users/managedUsers/row-user-activety.html',
        displayName: '活动'
      }, {
        cellTemplate: 'src/admin/users/managedUsers/user-table-action-cell.html',
        displayName: '操作'
      }]
    }

    //deleteUser
    $scope['delete'] = function(row) {
      var deleteUserModal = $modal.open({
        templateUrl: 'src/admin/users/managedUsers/delete-user-modal.html',
        controller: deleteModalController,
        backdrop: 'static',
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
        }, function (error) {
            Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
            })
        }
        )
      })
    }

    //delete window ctrl
    var deleteModalController = [
      '$scope',
      '$modalInstance',
      'userId',
      function(
        $scope,
        $modalInstance,
        userId
      ) {
        $scope.ok = function() {
          $modalInstance.close(userId)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    $scope.bulkEdit = function() {
      alert("bulkEdit")
    }

    $scope.bulkadd = function() {
      alert("bulkadd")
    }
    
	//导出用户到excel
    $scope.exportUser = function() {
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/user/list?act=toExcel&token='+ $cookies.accessToken
    }
    
  }
])