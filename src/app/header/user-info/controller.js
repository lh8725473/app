angular.module('App.Header').controller('App.Header.UserInfoController', [
  '$scope',
  '$rootScope',
  '$modalInstance',
  'Users',
  'Notification',
  '$modal',
  '$upload',
  'CONFIG',
  '$cookies',
  function(
    $scope,
    $rootScope,
    $modalInstance,
    Users,
    Notification,
    $modal,
    $upload,
    CONFIG,
    $cookies  
  ) {
    //个人设置信息
    $scope.userInfo = Users.getUserInfo()
    
    //修改个人信息
    $scope.updateInfo = function(){
      var msg = ""
      if($scope.userInfo.new_password != $scope.userInfo.confim_password){
        msg = "新密码与确认密码不一致";
      }
      else if($scope.userInfo.new_password.length < 6 || $scope.userInfo.new_password.length > 16){
        msg = "密码长度必须为6-16位";
      }
      if(msg != ""){
        Notification.show({
          title : '失败',
          type : 'danger',
          msg : msg,
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
    
    //更新用户头像
    $scope.updateImg = function(){
      $scope.onFileSelect = function($files) {
            var file = $files[0];
            (function(file) {
              file.upload = $upload.upload({
                url: CONFIG.API_ROOT + '/user/avatar?token=' + $cookies.accessToken,
                method: 'POST',
                withCredentials: true,
                data: {
                  file_name: file.name
                },
                file: file,
                fileFormDataName: 'Filedata',
              }).progress(function(evt) {
                file.progress = parseInt(100.0 * evt.loaded / evt.total)
              }).success(function(data, status, headers, config) {
                var avatar = $scope.userInfo.avatar
                $scope.userInfo.avatar = ''
                $scope.userInfo.avatar = avatar + '&_=' + new Date().getTime()
                $rootScope.$broadcast('updateUserImg');
                file.progress = 100
              });
          })(file);
          
        };
    }
    
    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }
])