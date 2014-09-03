angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  '$cookieStore',
  'Message',
  '$timeout',
  '$modal',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies,
    $cookieStore,
    Message,
    $timeout,
    $modal
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
  			$scope.messageCount = $scope.unreadCount.letter
  			$scope.noticeCount = $scope.unreadCount.notice
			  $scope.showMessageCount = $scope.messageCount != 0
			  $scope.showMoticeCount = $scope.noticeCount != 0
  		})
  		$timeout($scope.pollForMessages, 100000)
  	}
  	
  	$scope.pollForMessages()
  	
  	$scope.id = $cookies.userId
    	
    $scope.user = Users.getUserById({id: $scope.id})
    
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