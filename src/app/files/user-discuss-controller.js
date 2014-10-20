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
  '$cookies',
  'Notification',
  function(
    $scope,
    CONFIG,
    Share,
    UserDiscuss,
    Users,
    Files,
    Utils,
    $modal,
    Folders,
    $cookies,
    Notification

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

    //@配置
    var atWhoShown = false
  	$scope.atOptions = {
      at: "@",
      data: [],
      limit: 5,
      onShown: function () {
        atWhoShown = true
      },
      onHidden: function () {
        atWhoShown = false
      }
    }

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

      	$scope.userDiscussList.$promise.then(function(userDiscussList){
      	  angular.forEach(userDiscussList, function(userDiscuss) {
      	    if(userDiscuss.user_id == $cookies.userId){//讨论是否是当前用户
      	      userDiscuss.is_owner = true
      	    }
      	  })
      	  $scope.loading = false
      	})

      	//历史版本
      	$scope.fileHistoryList = Files.history({
          file_id : discuss_file_id
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
            var userNameList = []
            $scope.userList = shareObj.list.users
            angular.forEach($scope.userList, function(user){
              userNameList.push(user.user_name)
            })
            $scope.atOptions.data = userNameList
          })
        })
      }
    })

  	//删除讨论
  	$scope.deleteUserDiscuss = function(userDiscuss){
  	  UserDiscuss.deleteUserDiscuss({
        id : userDiscuss.id
      }).$promise.then(function() {
        for (var i = 0; i < $scope.userDiscussList.length; ++i) {
          if ($scope.userDiscussList[i].id == userDiscuss.id) {
            $scope.userDiscussList.splice(i, 1)
            break
          }
        }
      }, function (error) {
            Notification.show({
              title: '失败',
              type: 'danger',
              msg: error.data.result,
              closeable: false
            })
          }
        )
  	}

  	//回复讨论
  	$scope.replyUserDiscuss = function(userDiscuss){
  	  $scope.discussContent = $scope.discussContent + '@' + userDiscuss.real_name + ' '
  	}

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
      if($event.which === 13 && !atWhoShown){//回车事件
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

    //下载历史版本
    $scope.downLoadHistory = function(fileHistory){
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/file/get/' + fileHistory.file_id + '?token=' + $cookies.accessToken + '&v=' + fileHistory.version_id
    }

  }
])
