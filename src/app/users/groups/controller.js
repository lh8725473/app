angular.module('App.Users.Groups').controller('App.Users.Groups.Controller', [
  '$scope',
  '$modal',
  '$timeout',
  'Notification',
  'Group',
  'Users',
  function(
    $scope,
    $modal,
    $timeout,
    Notification,
    Group,
    Users
  ) {
    //groupList data
    $scope.groupList = Group.query()
    
    //group grid
    $scope.groupGridOptions = {
      data : 'groupList',
      selectedItems : [],
      headerRowHeight: 36,
      enableRowSelection : false,
          rowHeight: 60,
      columnDefs : [{
        displayName : '群组名称',
        cellTemplate : 'src/app/users/groups/row-groups-name.html'    
      }, {
        field : 'user_count',
        displayName : '组员'
      }, {
        field : 'group_name',
        displayName : '动态'
      },{
        displayName : '操作',
        cellTemplate : 'src/app/users/groups/group-table-action-cell.html'
      }]
    }
    
    //addGroup window
      $scope.addGroup = function() {
          var addGroupModal = $modal.open({
              templateUrl: 'src/app/users/groups/add-group-modal.html',
              windowClass: 'add-group-modal-view',
              controller: addGroupModalController
          })

          addGroupModal.result.then(function(group) {
              Group.create({}, group).$promise.then(function(group) {
                  $scope.groupList.push(group)
                  Notification.show({
                      title: '成功',
                      type: 'success',
                      msg: '添加群组成功',
                      closeable: true
                  })
              }, function (error) {
                  Notification.show({
                      title: '失败',
                      type: 'danger',
                      msg: error.data.result,
                      closeable: false
                  })
              })
          })
      }
      
      //addGroup window ctrl
      var addGroupModalController = [
        '$scope',
        '$modalInstance',
        function(
          $scope,
          $modalInstance
        ) {
            $scope.addMembers = {}

            //addMember grid
            $scope.addMemberGridOptions = {
                data : 'addMembers',
                selectedItems : [],
                enableRowSelection : false,
                columnDefs : [{
                    field : 'user_name',
                    displayName : '成员'
                }, {
                    field : 'email',
                    displayName : '邮件地址'
                },{
                    displayName : '组内权限',
                    cellTemplate : 'src/app/users/groups/row-member-role.html'
                }]
            }
            
            $scope.addMemberWindow = function(){
              var addMemberWindowModal = $modal.open({
                     templateUrl: 'src/app/users/groups/add-member-window-modal.html',
                     windowClass: 'add-member-window-modal',
                     controller: addMemberWindowController,
                       resolve: {
                            addMembers: function() {
                                return $scope.addMembers
                            },
                            userList : function(){
                                return Users.query()
                            }
                        }           
              })

                addMemberWindowModal.result.then(function(selectedData) {
                    $scope.addMembers = selectedData;
                })
            }

            var addMemberWindowController = [
              '$scope',
              '$modalInstance',
              'addMembers',
              'userList',
              function(
                $scope,
                $modalInstance,
                addMembers,
                userList
              ) {
                //userList data
                  $scope.selectedData = [];
                  angular.forEach(addMembers, function(addMember) {
                      $scope.selectedData.push(addMember)
                  })
                  $scope.userList = userList
                  // 过滤后的数据
                  $scope.shownData = [];
                 
                $scope.selectedMemberGridOptions = {
                    data : 'shownData',
                    selectedItems : $scope.selectedData,
                      rowHeight: 40,
                      showSelectionCheckbox: true,
                      selectWithCheckboxOnly: true,
                    columnDefs : [{
                    displayName: '姓名',
                          cellTemplate: 'src/app/users/groups/row-user-name.html'
                    }, {
                        field: 'email',
                    displayName: '邮件地址',
                          cellClass: 'gruop-add-email-row'
                    }]
                }

                  $scope.seachGroups = function(seachMembersValue) {
                      // 清空显示的user
                      $scope.shownData = []
                      // 重新计算
                      $scope.shownData = $($scope.userList).filter(function(index, user) {
                          if (!seachMembersValue || seachMembersValue.trim() === '') {
                              return true
                          } else if (user.user_name.toLowerCase().indexOf(seachMembersValue.toLowerCase()) != -1) {
                              return true
                          } else {
                              return false
                          }
                      })
                  }

                  userList.$promise.then(function() {
                      angular.forEach(userList, function(user) {
                          // 获取数据之后，全部填充到显示的数据中
                          $scope.shownData.push(user);
                      });
                  });

                  $timeout(function(){
                      angular.forEach($scope.userList, function(data, index) {
                          angular.forEach($scope.selectedData, function(addMember) {
                              if (data.user_id == addMember.user_id) {
                                  $scope.selectedMemberGridOptions.selectItem(index, true);
                              }
                          })
                      })
                  }, 500)

                  $scope.ok = function() {
                      $modalInstance.close($scope.selectedData)
                  }

                  $scope.cancel = function() {
                      $modalInstance.dismiss('cancel')
                  }
              }
            ]
          
            $scope.ok = function(group) {
                var addMembers = $scope.addMembers
                group.users = addMembers;
                // angular.forEach($scope.addMembers, function(addMember,group){
                //     group.user.push(addMember)
                // })
                $modalInstance.close(group)
            }

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel')
            }
        }
      ]
    
    //delete group
      $scope['delete'] = function(row) {
          var deleteUserModal = $modal.open({
              templateUrl: 'src/app/users/groups/delete-group-modal.html',
              controller: deleteModalController,
              resolve: {
                  groupId: function() {
                      return row.entity.group_id
                  }
              }
          })

          deleteUserModal.result.then(function(group_id) {
              Group['delete']({
                  id: group_id
              }).$promise.then(function() {
                  for (var i = 0; i < $scope.groupList.length; ++i) {
                      if ($scope.groupList[i].group_id == group_id) break
                  }
                  $scope.groupList.splice(i, 1)
              })
          })
      }
      
      //delete window ctrl
      var deleteModalController = [
        '$scope',
        '$modalInstance',
        'groupId',
        function(
          $scope,
          $modalInstance,
          groupId
        ) {
            $scope.ok = function() {
                $modalInstance.close(groupId)
            }

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel')
            }
        }
      ]
      
      //editGroup
      $scope.edit = function edit(row) {
          var editUserModal = $modal.open({
              templateUrl: 'src/app/users/groups/update-group-modal.html',
              controller: editModalController,
              resolve: {
                  editGroup: function() {
                      // Past the ref to the modal
                      return angular.copy(row.entity)
                  }
              }
          })

          editUserModal.result.then(function(editGroup) {
              Group.update({
                  id: editGroup.group_id
              }, editGroup)
              angular.extend(row.entity, editGroup)
          })
      }

      //edit window ctrl
      var editModalController = [
        '$scope',
        '$modalInstance',
        'editGroup',
        function(
          $scope,
          $modalInstance,
          editGroup
        ) {
            $scope.editGroup = editGroup

            $scope.ok = function() {
                $modalInstance.close($scope.editGroup)
            }

            $scope.cancel = function() {
                $modalInstance.dismiss('cancel')
            }
        }
      ]

  }
])