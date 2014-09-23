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
  '$state',
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
    Notification,
    $state
  ) {
    $scope.toLogin = function(){
      $cookieStore.removeCookie('accessToken')
      $cookieStore.removeCookie('userName')
      $cookieStore.removeCookie('userPic')
      $cookieStore.removeCookie('userId')
      $cookieStore.removeCookie('userType')
      $cookieStore.removeCookie('roleId')
      window.location.href = "login.html"
    }
    
  	$scope.toadmin = function(){
  	  window.location.href = "admin.html"
  	}
  	
  	//加载动画
  	$scope.loading = true
  	
  	$scope.messageCount = 0
  	$scope.noticeCount = 0
  	$scope.showMessageCount = !!$scope.messageCount
  	$scope.showMoticeCount = !!$scope.noticeCount
    $scope.roleId = $cookieStore.readCookie('roleId')
  	
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
  	  $scope.loading = true
  	  $scope.messageList = Message.getMessageList()
  	  $scope.messageList.$promise.then(function() {
        $scope.loading = false
      })
  	}
  	 	
  	//点击单个消息
  	$scope.messageDetail = function(message){
  	  $scope.pollForMessages()
  	  $rootScope.$broadcast('message_file', message.obj_id);
  	}
  	
  	//notice 列表
  	$scope.openNoticeList = function(){
  	  $scope.loading = true
      $scope.noticeList = Message.getNoticeList()
      $scope.noticeList.$promise.then(function() {
        $scope.loading = false
      })
    }
  	
  	//message标记为已读
  	$scope.toIsRead = function($event, message){
  	  $event.stopPropagation()
      Message.toIsRead({
        id : message.id
      }).$promise.then(function() {
        message.is_read = 'true'
        $scope.pollForMessages()
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
        for (var i = 0; i < $scope.messageList.length; ++i) {
          if ($scope.messageList[i].id == message.id) {
            $scope.messageList.splice(i, 1)
            break
          }
        }
        $scope.pollForMessages()
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
    
    //搜索文件或者文件夹
    function doSearch(searchFilesValue) {
      $state.go('files', {
        k: searchFilesValue
      })
      $rootScope.$broadcast('searchFilesValue', searchFilesValue);
    }
    
    $scope.searchByKeyDown = function($event, searchFilesValue){
      if ($event.which === 13) {
        doSearch(searchFilesValue)
      }
    }
    
    $scope.searchByButton = doSearch
    
    //个人信息
    $scope.userInfoWin = function(){
      var userInfoModal = $modal.open({
        templateUrl: 'src/app/header/user-info/template.html',
        windowClass: 'user-info',
        backdrop: 'static',
        controller: 'App.Header.UserInfoController',
        resolve: {}
      })
      
      userInfoModal.result.then(function(real_name) {
        $scope.user.real_name = real_name  
      })
    }
  }
])