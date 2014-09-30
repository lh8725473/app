angular.module('App.Files').controller('App.Files.CreateTagController', [
  '$scope',
  '$modalInstance',
  'obj',
  'Tag',
  'Notification',
  function(
    $scope,
    $modalInstance,
    obj,
    Tag,
    Notification
  ) {
    $scope.obj = obj
    
    //创建标签的标签名
    $scope.tag_name = ''
    
    //创建标签
    $scope.createTag = function(){
      if($scope.tag_name == ''){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '标签不能为空',
          closeable: false
        })
        return     
      }
      if($scope.obj.tags.length == 3){
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '标签个数不能超过3个',
          closeable: false
        })
        return
      }
      
      Tag.createTag({},{
        obj_id : (obj.isFolder == 1) ? obj.folder_id : obj.file_id,
        obj_type : (obj.isFolder == 1) ? 'folder' : 'file',
        tag_name : $scope.tag_name
      }).$promise.then(function(tag) {
        $scope.obj.tags.push(tag)
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
    $scope.deleteTag = function (tag){
      Tag.deleteTag({
        tag_id : tag.tag_id,
        obj_id : (obj.isFolder == 1) ? obj.folder_id : obj.file_id,
        obj_type : (obj.isFolder == 1) ? 'folder' : 'file'
      }).$promise.then(function() {
        for (var i = 0; i < obj.tags.length; ++i) {
          if (obj.tags[i].tag_id == tag.tag_id) {
            obj.tags.splice(i, 1)
            break
          }
        }
        
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '删除标签成功',
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
    
    function moved(file_id) {
      $modalInstance.close(file_id)
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }
])