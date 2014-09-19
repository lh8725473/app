angular.module('App.Files').controller('App.Files.CreateTagController', [
  '$scope',
  '$modalInstance',
  'obj',
  function(
    $scope,
    $modalInstance,
    obj
  ) {
    $scope.obj = obj
    
    //创建标签的标签名
    $scope.tag_name = ''
    
    //创建标签
    $scope.createTag = function(){
      Tag.createTag({},{
        obj_id : obj.file_name,
        obj_type : (obj.isFolder == 1) ? 'folder' : 'file',
        tag_name : $scope.tag_name
      }).$promise.then(function() {
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '添加标签成功',
          closeable: true
        })
      }, function (error) {
           Notification.show({
             title: '失败',
             type: 'danger',
             msg: error.data.result,
             closeable: false
           })
      })
    }
    
    //删除标签
    $scope.deleteTag = function (){
      Tag.deleteTag({},{
        obj_id : obj.file_name,
        obj_type : (obj.isFolder == 1) ? 'folder' : 'file',
        tag_name : $scope.tag_name
      })
    }
    
    function moved(file_id) {
      $modalInstance.close(file_id)
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }
])