angular.module('App.Files').controller('App.Files.UserDiscussController', [
  '$scope',
  'CONFIG',
  'Share',
  'UserDiscuss',
  'Users',
  'Files',
  'Utils',
  '$modal',
  'Folders',
  function(
    $scope,
    CONFIG,
    Share,
    UserDiscuss,
    Users,
    Files,
    Utils,
    $modal,
    Folders
  ) {
      
//  $scope.userList = Users.query()     
//  $scope.userList.$promise.then(function() {
//    angular.forEach($scope.userList, function(user) {
//      user.username = user.user_name
//    })
//  })
    
    
  	var discuss_file_id = $scope.discuss_file_id || 0;
  	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
  		obj_id : discuss_file_id
  	})
  	
    //右侧菜单 讨论or版本
    $scope.navType = 'dis'
    $scope.changeNavType = function(navType) {
      $scope.navType = navType
    }
    
    //监听讨论的文件ID
    $scope.$watch('discuss_file_id', function (new_file_id) {
      $scope.loading = true
      discuss_file_id = new_file_id
      if(discuss_file_id){
      	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
        	obj_id : discuss_file_id
      	})
      	
      	$scope.userDiscussList.$promise.then(function(){
      	  $scope.loading = false
      	})
      	
      	//讨论的文件
      	$scope.file = Files.view({
          file_id : discuss_file_id
        })
      	
      	//文件关联的协作人
      	$scope.file.$promise.then(function(file){
      	  var fileType = Utils.getFileTypeByName(file.file_name)
      	  $scope.isPreview = fileType ? true : false
      	  $scope.shareObj = Folders.queryShareObj({
            folder_id : $scope.file.folder_id
          })
          $scope.shareObj.$promise.then(function(shareObj){
            $scope.userList = shareObj.list.users
            angular.forEach($scope.userList, function(user){
              user.username = user.user_name
            })
          })
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
  	
  	//检查预览的文件大小及类型
    function checkFileValid (obj) {
      var fileSize = obj.file_size;
      var fileType = Utils.getFileTypeByName(obj.file_name);
      if ('office' == fileType) {
        //office文档最大预览为10M
        if (fileSize > 10485760) {
          return false;
        }
      }
      else
        if('pdf'==fileType){
          //pdf设置最大预览为50M
          if(fileSize>52428800)
          {
            return false;
          }
        }
      return true;
    }
    
    //文件预览
    $scope.previewFile = function () {
      var validFile = checkFileValid($scope.file);
      if (validFile) {
        var previewFileModal = $modal.open({
          templateUrl: 'src/app/files/preview-file/template.html',
          windowClass: 'preview-file',
          backdrop: 'static',
          controller: 'App.Files.PreviewFileController',
          resolve: {
            obj: function () {
              return $scope.file
            }
          }
        })
      }else {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '仅仅允许预览10MB以下文件。',
          closeable: false
        })
      }
    }
  	
  }
])