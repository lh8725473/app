angular.module('App.Header').controller('App.Header.Controller', [
  '$scope',
  '$translatePartialLoader',
  'CONFIG',
  'Users',
  '$cookies',
  'Message',
  '$timeout',
  function(
    $scope,
    $translatePartialLoader,
    CONFIG,
    Users,
    $cookies,
    Message,
    $timeout
  ) {
  	$scope.backToindex = function(){
  	  window.location.href = CONFIG.LOGIN_PATH
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
  }
])