angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$rootScope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  '$cookieStore',
  'Message',
  '$timeout',
  '$modal',
  'Notification',
  function(
    $scope,
    $rootScope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies,
    $cookieStore,
    Message,
    $timeout,
    $modal,
    Notification
  ) {
    $scope.toLogin = function(){
      $cookieStore.removeCookie('accessToken')
      window.location.href = "login.html"
    }
    
  	$scope.toadmin = function(){
  	  window.location.href = "admin.html"
  	}
  	
  	$scope.messageCount = 0
  	$scope.noticeCount = 0
  	$scope.showMessageCount = !!$scope.messageCount
  	$scope.showMoticeCount = !!$scope.noticeCount
  	
  	$scope.pollForMessages = function(){
  		$scope.unreadCount = Message.getUnreadMessagesCount()
  		$scope.unreadCount.$promise.then(function(){
  			$scope.messageCount = $scope.unreadCount.message
  			$scope.noticeCount = $scope.unreadCount.notice
			  $scope.showMessageCount = $scope.messageCount != 0
			  $scope.showMoticeCount = $scope.noticeCount != 0
  		})
  		$timeout($scope.pollForMessages, 100000)
  	}
  	
  	//循环执行消息系统
  	$scope.pollForMessages()
  	
  	//message 列表
  	$scope.openMessageList = function(){
  	  $scope.messageList = Message.getMessageList()
  	}
  	
  	//点击单个消息
  	$scope.messageDetail = function(message){
  	  $rootScope.$broadcast('message_file', message.obj_id);
  	}
  	
  	//notice 列表
  	$scope.openNoticeList = function(){
      $scope.noticeList = Message.getNoticeList()
    }
  	
  	//message标记为已读
  	$scope.toIsRead = function($event, message){
  	  $event.stopPropagation()
      Message.toIsRead({
        id : message.id
      }).$promise.then(function() {
        message.is_read = 'true'
        Notification.show({
          title: '成功',
          type: 'success',
          msg: "已标记为已读",
          closeable: true
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
  	}
  	
  	//删除message
  	$scope.deleteMessage = function($event, message){
      $event.stopPropagation()
      Message.deleteMessage({
        id : message.id
      }).$promise.then(function() {
        for (var i = 0; i < $scope.noticeList.length; ++i) {
          if ($scope.noticeList[i].id == message.id) {
            $scope.noticeList.splice(i, 1)
            break
          }
        }
        Notification.show({
          title: '成功',
          type: 'success',
          msg: "删除成功",
          closeable: true
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
    }
  	
  	//当前用户ID
  	$scope.id = $cookies.userId
    	
    $scope.user = Users.getUserById({id: $scope.id})
    
    //重载用户头像
    $scope.$on('updateUserImg', function() {
      var avatar = $scope.user.avatar
      $scope.user.avatar = ''
      $scope.user.avatar = avatar + '&_=' + new Date().getTime()
    })
    
    //个人信息
    $scope.userInfoWin = function(){
      var userInfoModal = $modal.open({
        templateUrl: 'src/app/header/user-info/template.html',
        windowClass: 'user-info',
        backdrop: 'static',
        controller: 'App.Header.UserInfoController',
        resolve: {}
      })
    }
  }
])