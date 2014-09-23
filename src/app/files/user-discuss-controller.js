angular.module('App.Files').controller('App.Files.UserDiscussController', [
  '$scope',
  'CONFIG',
  'Share',
  'UserDiscuss',
  'Users',
  function(
    $scope,
    CONFIG,
    Share,
    UserDiscuss,
    Users
  ) {
    
    $scope.userList = Users.query()     
    $scope.userList.$promise.then(function() {
      angular.forEach($scope.userList, function(user) {
        user.username = user.user_name
      })
    })
    
  	var discuss_file_id = $scope.discuss_file_id || 0;
  	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
  		obj_id : discuss_file_id
  	})
    
    //监听讨论的文件ID
    $scope.$watch('discuss_file_id', function (new_file_id) {
      discuss_file_id = new_file_id
      if(discuss_file_id){
      	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
        	obj_id : discuss_file_id
      	})
      } 
    })
  	
  	//讨论发表内容
  	$scope.discussContent = ''
  	//讨论字数
  	$scope.discussCount = 0
  	//发表按钮是否隐藏
  	$scope.discussButton = true
  	
  	//发表讨论
    $scope.createUserDiscuss = function(){
      UserDiscuss.createUserDiscuss({
        obj_id : discuss_file_id
      },{
        content :$scope.discussContent
      }).$promise.then(function(userDiscuss){
        $scope.discussContent = ''
        $scope.discussCount = 0
        $scope.discussButton = true
        $scope.userDiscussList.push(userDiscuss)
      })
    }
    
    //回车发表讨论
    $scope.createUserDiscussByPress = function($event){
      if($event.which === 13){//回车事件
        $event.preventDefault()
        $scope.createUserDiscuss()
      }
    }
  	
  	//输入讨论框监控
  	$scope.changeDiscussInput = function(discussContent){
  		$scope.discussCount = discussContent.length
  		if(discussContent.length>200){
  			$scope.discussButton = true
  		}else{
  			$scope.discussButton = false
  		}
  	}
  	
  }
])