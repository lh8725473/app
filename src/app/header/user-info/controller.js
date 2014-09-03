angular.module('App.Header').controller('App.Header.UserInfoController', [
  '$scope',
  '$modalInstance',
  'Users',
  'Notification',
  function(
    $scope,
    $modalInstance,
    Users,
    Notification
  ) {
    //个人设置信息
    $scope.userInfo = Users.getUserInfo()
    
    //修改个人信息
    $scope.updateInfo = function(){
      if($scope.new_password != $scope.confim_password){
        Notification.show({
          title : '失败',
          type : 'danger',
          msg : "新密码与确认密码不一致",
          closeable : false
        })
        return;
      }
      Users.updateUserInfo({},{
        real_name : $scope.userInfo.real_name,
        phone : $scope.userInfo.phone,
        new_password : $scope.userInfo.new_password,
        old_password : $scope.userInfo.old_password
      }).$promise.then(function() {
        $modalInstance.close()
      },function(error) {
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
])