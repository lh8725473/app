angular.module('App.Files').controller('App.Files.PreviewFileController', [
  '$scope',
  '$rootScope',
  'Utils',
  '$modalInstance',
  'CONFIG',
  'obj',
  'Files',
  '$cookies',
  '$sce',
  'UserDiscuss',
  '$modal',
  function(
    $scope,
    $rootScope,
    Utils,
    $modalInstance,
    CONFIG,
    obj,
    Files,
    $cookies,
    $sce,
    UserDiscuss,
    $modal
  ) { 
      //预览对象
      $scope.obj = obj
      //右侧菜单 讨论or版本
      $scope.navType = 'dis'

      $scope.changeNavType = function(navType) {
        $scope.navType = navType
      }

      $scope.fileType = Utils.getFileTypeByName(obj.file_name)

      if ('image' == $scope.fileType) {//图片预览
        $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.accessToken
      } else {//office或者pdf预览
        Files.preview(obj.file_id).then(function(htmlData) {
          $scope.previewValue = htmlData
        })
      }
      
      $scope.$on('uploadNewFileDone', function() {
        $scope.fileType = Utils.getFileTypeByName(obj.file_name)

        if ('image' == $scope.fileType) {//图片预览
          $scope.imageSrc = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.accessToken + '&_=' + new Date().getTime()
        } else {//office或者pdf预览
          Files.preview(obj.file_id, true).then(function(htmlData) {
            $scope.previewValue = htmlData
          })
        }
        
        $scope.fileHistoryList = Files.history({
          file_id : obj.file_id
        })
      })
      
      //上传新版本
      var uploadModalController = [
        '$scope',
        '$modalInstance',
        '$cookies',
        '$state',
        function(
          $scope,
          $modalInstance,
          $cookies,
          $state
        ) {
          $scope.onFileSelect = function($files) {
            $modalInstance.close($files)
          };

          $scope.cancel = function() {
            $modalInstance.dismiss('cancel')
          }
        }
      ]

      //上传新版本
      $scope.upload = function() {
        var uploadModal = $modal.open({
          templateUrl: 'src/app/files/modal-upload.html',
          windowClass: 'modal-upload',
          backdrop: 'static',
          controller: uploadModalController,
          resolve: {}
        })

        uploadModal.result.then(function($files) {
          $rootScope.$broadcast('uploadNewFile', $files, obj.file_id);
        })
      }
      
      //预览讨论
      $scope.userDiscussList = UserDiscuss.getUserDiscussList({
        obj_id : obj.file_id
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
          obj_id : obj.file_id
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
      
      //预览历史版本
      $scope.fileHistoryList = Files.history({
        file_id : obj.file_id
      })
      
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
      
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
      }
  }
])