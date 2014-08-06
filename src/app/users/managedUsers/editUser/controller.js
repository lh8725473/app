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
    if ($scope.user.config.desktop_sync == 'true') {
      $scope.user.config.desktop_sync = true
    };
  })
  	
	$scope.gridGroup = {
      data: 'userGroup',
      selectedItems: $scope.selectedData,
      enableRowSelection : false,
      columnDefs: [{
        field: 'group_name',
        displayName: '群组名称'
      }, {
        field: 'user_count',
        displayName: '人数'
      }, {
        field: 'user_count',
        displayName: '组内权限'
      }]
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