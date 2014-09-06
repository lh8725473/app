angular.module('App.LinkShare').controller('App.LinkShare.Controller', [
  '$scope',
  '$rootScope',
  'CONFIG',
  'Share',
  'Utils',
  '$modal',
  '$state',
  '$cookieStore',
  'Folders',
  function(
    $scope,
    $rootScope,
    CONFIG,
    Share,
    Utils,
    $modal,
    $state,
    $cookieStore,
    Folders
  ) {
    
    //链接分享Key
    $scope.key = $state.params.key
    //链接分享所在文件ID
    $scope.folderId = $state.params.folderId || 0
    if($scope.folderId == 0){
      $scope.isRoot = true
    }
    
    //外部链接文件列表(不需要密码时)
    $scope.linkShareList = Share.getLinkShareList({
      key : $scope.key,
      pwd : $cookieStore.get('password'),
      folder_id : $scope.folderId
    })
    
    //外部链接文件列表(需要密码时)
    $scope.$on('password', function($event, password) {
      $scope.linkShareList = Share.getLinkShareList({
        key : $scope.key,
        pwd : password
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
        var neddPassword = true;
        $rootScope.$broadcast('neddPassword', neddPassword);
        $rootScope.$broadcast('key', $scope.key);
      })
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
      var neddPassword = true;
      $rootScope.$broadcast('neddPassword', neddPassword);
      $rootScope.$broadcast('key', $scope.key);
    })

    
    //点击选择或者取消选中文件
    $scope.selectRecycle = function($event, linkShare){
      //阻止事件冒泡
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
    
    //外部链接文件夹路径
    $scope.folderPath = Folders.getFolderPath({
      folder_id: $scope.folderId,
      key : $scope.key
    })
    
    //下载文件
    $scope.downloadFile = function(){
      for (var i = 0; i < $scope.linkShareList.length; ++i) {
        if ($scope.linkShareList[i].checked == true)
          break
      }
      $scope.checkedObj = $scope.linkShareList[i]
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/share/key?act=download&key=' + $scope.key + '&pwd=' + $cookieStore.get('password') +'&file_id=' + $scope.checkedObj.file_id
    }
    
    //上传文件
    $scope.upload = function() {
      var uploadModal = $modal.open({
        templateUrl: 'src/linkShare/main/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: uploadModalController,
        resolve: {}
      })

      uploadModal.result.then(function($files) {
        $rootScope.$broadcast('uploadFiles', $files);
      })
    }
    
    // upload file
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
  }
])