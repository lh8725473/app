angular.module('App.LinkShare').controller('App.LinkShare.Controller', [
  '$scope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  '$state',
  function(
    $scope,
    CONFIG,
    Share,
    Utils,
    $modal,
    $state
  ) {
    
    //链接分享Key
    $scope.key = $state.params.key
    //链接分享所在文件ID
    $scope.folderId = $state.params.folderId
    
    //外部链接文件列表
    $scope.linkShareList = Share.getLinkShareList({
      key : $scope.key
    })
    
    //外部链接详细信息
    $scope.linkDetail = Share.getLinkShareDetail({
      key : $scope.key
    })
    
    $scope.linkDetail.$promise.then(function(linkDetail) {
      if(linkDetail.comment==''){
        linkDetail.comment = 'Ta很懒什么也没留下'
      }
    })
    
    $scope.linkShareList.$promise.then(function(linkShareList) {
      angular.forEach(linkShareList, function(linkShare){
        //对象是否被选中
        linkShare.checked = false
        
        //对象是否是文件夹
        if (linkShare.isFolder == 1) {
          linkShare.folder = true
        } else {
          linkShare.folder = false
        }
        
        //文件图像
        if (linkShare.isFolder == 1) { //文件夹
          if (linkShare.isShared == 1) {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            linkShare.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            linkShare.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else {
          var ext;
          if (linkShare.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = linkShare.file_name.slice(linkShare.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          linkShare.smallIcon = icon.small;
          linkShare.largeIcon = icon.large;
        }
      })
    },function(error) {
      Notification.show({
        title: '失败',
        type: 'danger',
        msg: error.data.result,
        closeable: false
      })
    })

    
    //点击选择或者取消选中文件
    $scope.selectRecycle = function($event, linkShare){
      //阻止时间冒泡
      $event.stopPropagation()
      linkShare.checked = !linkShare.checked
    }
    
    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.linkShareList, function(linkShare) {
        linkShare.checked = !$scope.selectedAll
      })
    }
     
    //清空回收站
    $scope.emptyRecycle = function(){
      var emptyRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/empty-recycle-confim.html',
        windowClass: 'empty-recycle',
        backdrop: 'static',
        controller: emptyRecycleController,
        resolve: {
          linkShareList: function() {
            return $scope.linkShareList
          }
        }
      })
      
      emptyRecycleModal.result.then(function() {
        Trash.emptyRecycle().$promise.then(function() {
            $scope.linkShareList = []
        })
      })
    }
    
    // emptyRecycle file
    var emptyRecycleController = [
      '$scope',
      '$modalInstance',
      'linkShareList',
      function(
        $scope,
        $modalInstance,
        linkShareList
      ) {
             
        $scope.ok = function() {
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    
    //彻底删除文件
    $scope.deleteRecycle = function(){
      var deleteRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/delete-recycle-confim.html',
        windowClass: 'delete-recycle',
        backdrop: 'static',
        controller: deleteRecycleController,
        resolve: {
          linkShareList: function() {
            return $scope.linkShareList
          }
        }
      })
    }
    
    // deleteRecycle file
    var deleteRecycleController = [
      '$scope',
      '$modalInstance',
      'linkShareList',
      function(
        $scope,
        $modalInstance,
        linkShareList
      ) {
        
        $scope.ok = function() {   
          angular.forEach(linkShareList, function(linkShare){
            if(linkShare.checked){
              linkShare.obj_type = linkShare.folder?'folder' : 'file' ;
              Trash.deleteRecycle({
                obj_type : linkShare.obj_type,
                obj_id : linkShare.file_id
              }).$promise.then(function() {
                for (var i = 0; i < linkShareList.length; ++i) {
                  if (linkShareList[i].file_id == linkShare.file_id) {
                    linkShareList.splice(i, 1)
                    break
                  }
                }
              })
            }
          })  
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    
    //还原文件
    $scope.revertRecycle = function(){
      var revertRecycleModal = $modal.open({
        templateUrl: 'src/app/trash/revert-recycle-confim.html',
        windowClass: 'revert-recycle',
        backdrop: 'static',
        controller: revertRecycleController,
        resolve: {
          linkShareList: function() {
            return $scope.linkShareList
          }
        }
      })
    }
    
    // revertRecycle file
    var revertRecycleController = [
      '$scope',
      '$modalInstance',
      'linkShareList',
      function(
        $scope,
        $modalInstance,
        linkShareList
      ) {
        
        $scope.ok = function() {   
          angular.forEach(linkShareList, function(linkShare){
            if(recycle.checked){
              linkShare.obj_type = linkShare.folder?'folder' : 'file' ;
              Trash.revertRecycle({},{
                obj_type : linkShare.obj_type,
                obj_id : linkShare.file_id
              }).$promise.then(function() {
                for (var i = 0; i < linkShareList.length; ++i) {
                  if (linkShareList[i].file_id == linkShare.file_id) {
                    linkShareList.splice(i, 1)
                    break
                  }
                }
              })
            }
          })  
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    
  }
])