angular.module('App.Files').controller('App.Files.PreviewFileController', [
  '$scope',
  'Utils',
  '$modalInstance',
  'CONFIG',
  'obj',
  'Files',
  '$cookies',
  '$sce',
  'UserDiscuss',
  function(
    $scope,
    Utils,
    $modalInstance,
    CONFIG,
    obj,
    Files,
    $cookies,
    $sce,
    UserDiscuss
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

      $scope.userDiscussList = UserDiscuss.getUserDiscussList({
        obj_id : obj.file_id
      })

      $scope.fileHistoryList = Files.history({
        file_id : obj.file_id
      })
      
      $scope.cancel = function() {
        $modalInstance.dismiss('cancel')
      }
  }
])