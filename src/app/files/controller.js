angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  '$rootScope',
  'CONFIG',
  'Folders',
  'Users',
  'FolderAction',
  'Notification',
  'Files',
  'DownLoadFile',
  '$modal',
  '$cookies',
  'Utils',
  'UserDiscuss',
  function(
    $scope,
    $state,
    $rootScope,
    CONFIG,
    Folders,
    Users,
    FolderAction,
    Notification,
    Files,
    DownLoadFile,
    $modal,
    $cookies,
    Utils,
    UserDiscuss
  ) {
    //权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    $scope.permissions = []
    angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key: key,
        value: $scope.permission_value[index]
      }
      $scope.permissions.push(permissionMap)
    })

    //Folder path 当前文件路径
    var folderId = $state.params.folderId || 0;
    $scope.folderPath = FolderAction.getFolderPath({
      folder_id: folderId
    })

    //是否为根目录
    if (folderId == 0) {
      $scope.isRoot = true
    } else {
      $scope.isRoot = false
    }

    //fileList data
    $scope.objList = Folders.getObjList({
      folder_id: folderId
    })

    $scope.$on('uploadFilesDone', function() {
      $scope.objList = Folders.getObjList({
        folder_id: folderId
      })
    })

    $scope.objList.$promise.then(function(objList) {
      angular.forEach(objList, function(obj) {
        //对象是否被选中
        obj.checked = false
        //对象是否显示重名输入框
        obj.rename = false

        //对象是否是文件夹
        if (obj.isFolder == 1) {
          obj.folder = true
        } else {
          obj.folder = false
        }

        //对象是否能被预览
        var fileType = Utils.getFileTypeByName(obj.file_name)
        if (!fileType) {
          obj.isPreview = false
        } else {
          obj.isPreview = true
        }

        //文件图像
        if (obj.isFolder == 1) { //文件夹
          if (obj.isShared == 1) {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else {
          var ext;
          if (obj.isFolder == 1) {
            ext = 'folder';
          } else {
            ext = obj.file_name.slice(obj.file_name.lastIndexOf('.') + 1);
          }
          var icon = Utils.getIconByExtension(ext);
          obj.smallIcon = icon.small;
          obj.largeIcon = icon.large;
        }

        //文件权限
        angular.forEach($scope.permission_key, function(key, index) {
          if (key == obj.permission) {
            obj.permission_value = $scope.permission_value[index]
          }
        })
      })
    })

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.objList, function(obj) {
        obj.checked = !$scope.selectedAll
      })
    }

    //新建文件夹
    $scope.showCreateFolderDiv = false
    $scope.showCreateFolder = function() {
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.cancleCreate = function() {
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.createFolder = function(createFolderName) {
      FolderAction.createFolder({
        folder_name: createFolderName,
        parent_id: folderId
      }).$promise.then(function(reFolder) {
        $scope.objList.push(reFolder)
        Notification.show({
          title: '成功',
          type: 'success',
          msg: '创建文件夹成功',
          closeable: true
        })
      })
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }

    //左键选取对象
    $scope.selectObj = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked
    }

    //右键菜单
    $scope.onRightClick = function(obj) {
      //取消所有选中状态
      angular.forEach($scope.objList, function(obj) {
        obj.checked = false
      })
      //右键对象选中
      obj.checked = true
      for (var i = 0; i < $scope.objList.length; ++i) {
        if ($scope.objList[i].checked == true)
          break
      }
      $scope.checkedObj = $scope.objList[i]
    }

    //右键选中的文件
    $scope.checkedObj = ''

    //删除单个文件或者文件夹(右键删除)	
    $scope.deleteObj = function() {
      for (var i = 0; i < $scope.objList.length; ++i) {
        if ($scope.objList[i].checked == true)
          break
      }
      if ($scope.objList[i].isFolder == 1) { //文件夹
        FolderAction.deleteFolder({
          folder_id: $scope.objList[i].folder_id
        }).$promise.then(function() {
          $scope.objList.splice(i, 1)
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '删除文件成功',
            closeable: true
          })
        })
      } else { //文件
        Files.deleteFile({
          file_id: $scope.objList[i].file_id
        }).$promise.then(function() {
          $scope.objList.splice(i, 1)
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '创建文件夹成功',
            closeable: true
          })
        })
      }
    }

    //下载单个文件或者文件夹
    $scope.dowloadFile = function() {
      var hiddenIframeID = 'hiddenDownloader'
      var iframe = $('#' + hiddenIframeID)[0]
      if (iframe == null) {
        iframe = document.createElement('iframe')
        iframe.id = hiddenIframeID
        iframe.style.display = 'none'
        document.body.appendChild(iframe)
      }
      iframe.src = CONFIG.API_ROOT + '/file/get/' + $scope.checkedObj.file_id + '?token=' + $cookies.accessToken
    }

    //重命名文件或文件夹
    $scope.renameInputValue = ""
    $scope.renameFileForm = function() {
      $scope.checkedObj.rename = true
      if ($scope.checkedObj.isFolder == 1) { //文件夹
        $scope.renameInputValue = $scope.checkedObj.folder_name
      } else {
        $scope.renameInputValue = $scope.checkedObj.file_name
      }
    }

    $scope.renameFile = function(renameInputValue) {
      if ($scope.checkedObj.isFolder == 1) { //文件夹
        FolderAction.updateFolder({
          folder_id: $scope.checkedObj.folder_id
        }, {
          folder_name: renameInputValue
        }).$promise.then(function() {
          $scope.checkedObj.folder_name = renameInputValue
          $scope.checkedObj.rename = false;
        })
      } else {
        Files.updateFile({
          file_id: $scope.checkedObj.file_id
        }, {
          file_name: renameInputValue
        }).$promise.then(function() {
          $scope.checkedObj.file_name = renameInputValue
          $scope.checkedObj.rename = false;
        })
      }
    }

    $scope.cancleRenameFile = function() {
      $scope.checkedObj.rename = false
    }


    //移动文件或者文件夹
    $scope.moveFile = function() {
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/move-file/template.html',
        windowClass: 'move-file-modal-view',
        backdrop: 'static',
        controller: 'App.Files.MoveFileController',
        resolve: {
          obj: function() {
            return $scope.checkedObj
          }
        }
      })

      addUserModal.result.then(function(file_id) {
        for (var i = 0; i < $scope.objList.length; ++i) {
          if ($scope.objList[i].file_id == file_id) {
            $scope.objList.splice(i, 1)
            break
          }
        }
      })
    }

    // 打开讨论 默认是关闭的
    $scope.discussOpened = false
    $scope.openUserDiscuss = function(file_id) {
      $scope.discuss_file_id = file_id
      $scope.discussOpened = true
    }

    $scope.stopPropagation = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked

    }

    //邀请协作人
    $scope.inviteTeamUsers = function($event, obj) {
      $event.stopPropagation()
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users/template.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: 'App.Files.InviteTeamUsersController',
        resolve: {
          folderid: function() {
            return obj.folder_id
          }
        }
      })
    }

    //链接分享
    $scope.linkShare = function($event, obj) {
      $event.stopPropagation()
      var linkShareModal = $modal.open({
        templateUrl: 'src/app/files/link-share/template.html',
        windowClass: 'link-share',
        backdrop: 'static',
        controller: 'App.Files.LinkShareController',
        resolve: {
          obj: function() {
            return obj
          },
          users: function() {
            return Users.query().$promise;
          }
        }
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

    //上传
    $scope.upload = function() {
      var uploadModal = $modal.open({
        templateUrl: 'src/app/files/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: uploadModalController,
        resolve: {}
      })

      uploadModal.result.then(function($files) {
        $rootScope.$broadcast('uploadFiles', $files);
      })
    }

    //文件预览
    $scope.previewFile = function(obj) {
      var previewFileModal = $modal.open({
        templateUrl: 'src/app/files/preview-file/template.html',
        windowClass: 'preview-file',
        backdrop: 'static',
        controller: 'App.Files.PreviewFileController',
        resolve: {
          obj: function() {
            return obj
          }
        }
      })
    }

  }
]).directive('ngEnter', function() {
  return function(scope, element, attrs) {
    element.bind("keydown keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });

        event.preventDefault();
      }
    });
  };
});