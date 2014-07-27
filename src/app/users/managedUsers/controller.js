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
            controller: addUserModalController,
            resolve: {
                groupList: function() {
                    return Group.query()
                }
            }
        })

        addUserModal.result.then(function(user) {
            Users.create({}, user).$promise.then(function(resUser) {
                $scope.userList.push(resUser)
                Notification.show({
                    title: '成功',
                    type: 'success',
                    msg: '添加用户成功',
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

    //addUser window ctrl
    var addUserModalController = function($scope, $modalInstance, groupList) {
    	$scope.seachGroupsValue = 'aaa';
    	$scope.seachGroups = function(){
//  		$scope.groupList = $(groupList).map(function(i, v) {
//				if (v.group_name.toLowerCase().indexOf(seachGroupsValue.toLowerCase()) != -1) {
//					return v
//				}
//			}).get();
    		alert($scope.seachGroupsValue);
    	}
    	
        groupList.$promise.then(function() {
            angular.forEach(groupList, function(group) {
                group.showRoleMenu = false;
                group.groupRole = 1;
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
        	angular.forEach(groupList, function (group) {
        		if (group.showRoleMenu) {
        			groups.push({
        				group_id: group.group_id,
        				group_role: group.groupRole
        			})
        		}
        	})
        	user.groups = groups;
            $modalInstance.close(user)
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
        //      enableRowSelection : false,
        showSelectionCheckbox: true,
        columnDefs: [
            //      {
            //          field : 'user_id',
            //          displayName : 'userId'
            //      }, 
            {
                field: 'user_name',
                displayName: 'userName'
            }, {
                field: 'real_name',
                displayName: 'realName'
            }, {
                displayName: 'action',
                cellTemplate: 'src/app/users/managedUsers/user-table-action-cell.html'
            }
        ]
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
        console.log("Here I need to know which row was selected " + row.entity.user_id)
        var editUserModal = $modal.open({
            templateUrl: 'src/app/users/managedUsers/update-user-modal.html',
            controller: editModalController,
            resolve: {
                editUser: function() {
                    // Past the ref to the modal
                    return angular.copy(row.entity)
                }
            }
        })

        editUserModal.result.then(function(editUser) {
            Users.update({
                id: editUser.user_id
            }, editUser)
            angular.extend(row.entity, editUser)
        })
    }

    //edit window ctrl
    var editModalController = function($scope, $modalInstance, editUser) {
        $scope.editUser = editUser

        $scope.ok = function() {
            $modalInstance.close($scope.editUser)
        }

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel')
        }
    }

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
