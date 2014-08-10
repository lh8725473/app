angular.module('App.Users.ExternalUsers').controller('App.Users.ExternalUsers.Controller', function($scope, $modal, Notification, ExternalUser) {
	//groupList data
	$scope.externalUserList = ExternalUser.query()

	//group grid
	$scope.groupGridOptions = {
		data : 'externalUserList',
		selectedItems : [],
		headerRowHeight : 36,
		enableRowSelection : false,
		rowHeight : 60,
		columnDefs : [{
			displayName : '用户',
			cellTemplate : 'src/app/users/externalUsers/row-externalUser-name.html'
		}, {
			field : 'email',
			displayName : '组员'
		}, {
			displayName : '操作',
			cellTemplate : 'src/app/users/externalUsers/externalUser-table-action-cell.html'
		}]
	}

	//addGroup window
	$scope.addGroup = function() {
		var addGroupModal = $modal.open({
			templateUrl : 'src/app/users/groups/add-group-modal.html',
			windowClass : 'add-group-modal-view',
			controller : addGroupModalController
		})

		addGroupModal.result.then(function(group) {
			Group.create({}, group).$promise.then(function(group) {
				$scope.groupList.push(group)
				Notification.show({
					title : '成功',
					type : 'success',
					msg : '添加群组成功',
					closeable : true
				})
			}, function(error) {
				Notification.show({
					title : '失败',
					type : 'danger',
					msg : error.data.result,
					closeable : false
				})
			})
		})
	}
	//addGroup window ctrl
	var addGroupModalController = function($scope, $modalInstance) {
		$scope.showAddMember = false;

		$scope.switchAddMember = function() {
			$scope.showAddMember = !$scope.showAddMember;
		};

		$scope.ok = function(group) {
			$modalInstance.close(group)
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel')
		}
	}
	//delete group
	$scope['delete'] = function(row) {
		var deleteUserModal = $modal.open({
			templateUrl : 'src/app/users/groups/delete-group-modal.html',
			controller : deleteModalController,
			resolve : {
				groupId : function() {
					return row.entity.group_id
				}
			}
		})

		deleteUserModal.result.then(function(group_id) {
			Group['delete']({
				id : group_id
			}).$promise.then(function() {
				for (var i = 0; i < $scope.groupList.length; ++i) {
					if ($scope.groupList[i].group_id == group_id)
						break
				}
				$scope.groupList.splice(i, 1)
			})
		})
	}
	//delete window ctrl
	var deleteModalController = function($scope, $modalInstance, groupId) {
		$scope.ok = function() {
			$modalInstance.close(groupId)
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel')
		}
	}
	//editGroup
	$scope.edit = function edit(row) {
		var editUserModal = $modal.open({
			templateUrl : 'src/app/users/groups/update-group-modal.html',
			controller : editModalController,
			resolve : {
				editGroup : function() {
					// Past the ref to the modal
					return angular.copy(row.entity)
				}
			}
		})

		editUserModal.result.then(function(editGroup) {
			Group.update({
				id : editGroup.group_id
			}, editGroup)
			angular.extend(row.entity, editGroup)
		})
	}
	//edit window ctrl
	var editModalController = function($scope, $modalInstance, editGroup) {
		$scope.editGroup = editGroup

		$scope.ok = function() {
			$modalInstance.close($scope.editGroup)
		}

		$scope.cancel = function() {
			$modalInstance.dismiss('cancel')
		}
	}
})