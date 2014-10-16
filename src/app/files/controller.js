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
  '$stateParams',
  'Search',
  'Cloud',
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
    UserDiscuss,
    $stateParams,
    Search,
    Cloud
  ) {
    //权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    //加载动画
    $scope.loading = true

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
    $scope.isRoot = (folderId == 0) ? true : false

    //fileList data
    // var pageSize = 30
    var objListPage = 1
    $scope.objList = Folders.getObjList({
      folder_id: folderId,
      page: objListPage
    })
    $scope.objList.$promise.then(function() {
      $scope.loading = false
    })

    $scope.onFileListScroll = function(scrollTop, scrollHeight) {
      if (scrollTop == scrollHeight && !$scope.loading) {
        objListPage++
        $scope.loading = true
        var objList = Folders.getObjList({
          folder_id: folderId,
          page: objListPage
        })
        objList.$promise.then(function() {
          $scope.loading = false
          for (var i = 0; i < objList.length; i++) {
            $scope.objList.push(objList[i]);
          }
          refreshList()
        })
      }
    }

    //根目录(当前目录)下按钮权限
    $scope.folder_owner = true
    $scope.folder_delete = true
    $scope.folder_edit = true
    $scope.folder_getLink = true
    $scope.folder_preview = true
    $scope.folder_download = true
    $scope.folder_upload = true

    //当前目录下权限
    $scope.$on('folder_permission', function($event, folder_permission) {
      var folder_owner = folder_permission.substring(0, 1) //协同拥有者 or 拥有者1
      var folder_delete = folder_permission.substring(1, 2) //删除权限
      var folder_edit = folder_permission.substring(2, 3) //编辑权限
      var folder_getLink = folder_permission.substring(3, 4) //链接权限
      var folder_preview = folder_permission.substring(4, 5) //预览权限
      var folder_download = folder_permission.substring(5, 6) //下载权限
      var folder_upload = folder_permission.substring(6, 7) //上传权限
        //权限列表
      $scope.folder_owner = (folder_owner == '1') ? true : false
      $scope.folder_delete = (folder_delete == '1') ? true : false
      $scope.folder_edit = (folder_edit == '1') ? true : false
      $scope.folder_getLink = (folder_getLink == '1') ? true : false
      $scope.folder_preview = (folder_preview == '1') ? true : false
      $scope.folder_download = (folder_download == '1') ? true : false
      $scope.folder_upload = (folder_upload == '1') ? true : false
    })

    $scope.$on('uploadFilesDone', function() {
      $scope.objList = Folders.getObjList({
        folder_id: folderId
      })
      $scope.objList.$promise.then(function() {
        refreshList();

        Notification.show({
          title: '成功',
          type: 'success',
          msg: '上传文件成功',
          closeable: true
        })
      })
    })

    //渲染文件列表
    function refreshList() {
      angular.forEach($scope.objList, function(obj) {
        //权限列表
        var is_owner = obj.permission.substring(0, 1) //协同拥有者 or 拥有者1
        var is_delete = obj.permission.substring(1, 2) //删除权限
        var is_edit = obj.permission.substring(2, 3) //编辑权限
        var is_getLink = obj.permission.substring(3, 4) //链接权限
        var is_preview = obj.permission.substring(4, 5) //预览权限
        var is_download = obj.permission.substring(5, 6) //下载权限
        var is_upload = obj.permission.substring(6, 7) //上传权限

        obj.is_owner = (is_owner == '1') ? true : false
        obj.is_delete = (is_delete == '1') ? true : false
        obj.is_edit = (is_edit == '1') ? true : false
        obj.is_getLink = (is_getLink == '1') ? true : false
        obj.is_preview = (is_preview == '1') ? true : false
        obj.is_download = (is_getLink == '1') ? true : false
        obj.is_upload = (is_upload == '1') ? true : false

        //对象是否被选中
        obj.checked = false
        //对象是否显示重名输入框
        obj.rename = false

        //对象是否是文件夹
        obj.folder = (obj.isFolder == 1) ? true : false

        //对象是否能被预览
        var fileType = Utils.getFileTypeByName(obj.file_name || obj.folder_name)
        obj.isPreview = (fileType && obj.is_preview) ? true : false

        //文件图像
        if (obj.isFolder == 1) { //文件夹
          if (obj.isShared == 1) {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small_share;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large_share;
          } else {
            obj.smallIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.small;
            obj.largeIcon = CONFIG.ICONS_PATH + CONFIG.ICONS.folder.large;
          }
        } else if(fileType == 'image'){//图片缩略图
          obj.smallIcon = CONFIG.API_ROOT + '/file/preview/' + obj.file_id + '?token=' + $cookies.accessToken + '&size=48';
        }else {
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
          if (obj.owner_uid == $cookies.userId) { //拥有者
            obj.permission_value = '拥有者'
          } else {
            if (key == obj.permission) {
              obj.permission_value = $scope.permission_value[index]
            }
          }
        })

      })
    }
    $scope.objList.$promise.then(function() {
      refreshList();
    })

    //全部选择状态
    $scope.selectedAll = false

    $scope.selectedAllswitch = function() {
      angular.forEach($scope.objList, function(obj) {
        obj.checked = !$scope.selectedAll
      })
    }

    //新建文件夹
    $scope.createFolderData = {
      createFolderName: '',
      myInputFocus: false
    }
    $scope.showCreateFolderDiv = false
    $scope.showCreateFolder = function() {
      $scope.createFolderData.createFolderName = ''
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
      $scope.createFolderData.myInputFocus = !$scope.createFolderData.myInputFocus;
    }
    $scope.cancelCreate = function() {
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.createFolder = function(createFolderName) {
      FolderAction.createFolder({
        folder_name: createFolderName,
        parent_id: folderId
      }).$promise.then(function(reFolder) {
        $scope.objList = Folders.getObjList({
          folder_id: folderId
        })
        $scope.objList.$promise.then(function() {
          refreshList();
          Notification.show({
            title: '成功',
            type: 'success',
            msg: '创建文件夹成功',
            closeable: true
          })
        })
      }, function(error) {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: error.data.result,
          closeable: false
        })
      })
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    
    //批量删除
    $scope.deleteObjList = function(){
      var deleteLsit = []
      angular.forEach($scope.objList, function(obj) {
        if(obj.checked == true){
          deleteLsit.push(obj)
        }
      })
    }
    
    //批量移动
    $scope.removeObjList = function(){
      var removeLsit = []
      angular.forEach($scope.objList, function(obj) {
        if(obj.checked == true){
          removeLsit.push(obj)
        }
      })
    }
    
    //左键选取对象
    $scope.selectObj = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked
    }

    //右键菜单
    $scope.onRightClick = function(obj) {
      var obj_permission = obj.permission;
      var obj_owner = obj_permission.substring(0, 1) //协同拥有者 or 拥有者1
      var obj_delete = obj_permission.substring(1, 2) //删除权限
      var obj_edit = obj_permission.substring(2, 3) //编辑权限
      var obj_getLink = obj_permission.substring(3, 4) //链接权限
      var obj_preview = obj_permission.substring(4, 5) //预览权限
      var obj_download = obj_permission.substring(5, 6) //下载权限
      var obj_upload = obj_permission.substring(6, 7) //上传权限
        //权限列表
      var obj_owner = (obj_owner == '1') ? true : false
      var obj_delete = (obj_delete == '1') ? true : false
      var obj_edit = (obj_edit == '1') ? true : false
      var obj_getLink = (obj_getLink == '1') ? true : false
      var obj_preview = (obj_preview == '1') ? true : false
      var obj_download = (obj_download == '1') ? true : false
      var obj_upload = (obj_upload == '1') ? true : false

      //权限判断
      if (obj.owner_uid == $cookies.userId) { //拥有者
        $scope.show_delete_menu = true
        $scope.show_rename_menu = true
        $scope.show_remove_menu = true
      } else {
        if (obj_delete && obj.isShareObj == 0) {
          $scope.show_delete_menu = true
          $scope.show_rename_menu = true
          $scope.show_remove_menu = true
        } else {
          $scope.show_delete_menu = false
          $scope.show_rename_menu = false
          $scope.show_remove_menu = false
        }
      }

      if (obj.isFolder == 1) {
        $scope.show_discuss_menu = false
        $scope.show_download_menu = false
      } else {
        $scope.show_discuss_menu = true
        if (obj_download) {
          $scope.show_download_menu = true
        } else {
          $scope.show_download_menu = false
        }
      }

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
      var deleteRecycleModal = $modal.open({
        templateUrl: 'src/app/files/delete-file-confirm.html',
        windowClass: 'delete-file',
        backdrop: 'static',
        controller: deleteObjController,
        resolve: {
          objList: function() {
            return $scope.objList
          }
        }
      })
    }

    // deleteObj file
    var deleteObjController = [
      '$scope',
      '$modalInstance',
      'objList',
      function(
        $scope,
        $modalInstance,
        objList
      ) {

        $scope.objList = objList
        $scope.ok = function() {
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
                msg: '删除文件夹成功',
                closeable: true
              })
            }, function(error) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
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
                msg: '删除文件成功',
                closeable: true
              })
            }, function(error) {
              Notification.show({
                title: '失败',
                type: 'danger',
                msg: error.data.result,
                closeable: false
              })
            })
          }
          $modalInstance.close()
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

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
      $scope.checkedObj.focus = true
      $scope.checkedObj.rename = true
      if ($scope.checkedObj.isFolder == 1) { //文件夹
        $scope.checkedObj.renameInputValue = $scope.checkedObj.folder_name
      } else {
        var file_name = $scope.checkedObj.file_name
          //获取后缀名
        var extStart = file_name.lastIndexOf(".")
        var ext = file_name.substring(extStart, file_name.length)
        $scope.checkedObj.renameInputValue = file_name.substring(0, extStart)
      }
    }

    $scope.renameFile = function($event, obj) {
      $event.stopPropagation()
      if (obj.renameInputValue.replace(/^\s+|\s+$/g, "") == '') {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '文件或文件夹名不能为空',
          closeable: false
        })
        return
      }
      if (obj.isFolder == 1) { //文件夹
        FolderAction.updateFolder({
          folder_id: obj.folder_id
        }, {
          folder_name: obj.renameInputValue
        }).$promise.then(function() {
          obj.folder_name = obj.renameInputValue
          obj.rename = false;
        }, function(error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
        })
      } else {
        var file_name = obj.file_name
          //获取后缀名
        var extStart = file_name.lastIndexOf(".")
        var ext = file_name.substring(extStart, file_name.length)
        Files.updateFile({
          file_id: obj.file_id
        }, {
          file_name: obj.renameInputValue + ext
        }).$promise.then(function() {
          obj.file_name = obj.renameInputValue + ext
          obj.rename = false;
        }, function(error) {
          Notification.show({
            title: '失败',
            type: 'danger',
            msg: error.data.result,
            closeable: false
          })
        })
      }
    }

    $scope.cancelRenameFile = function($event, obj) {
      $event.stopPropagation()
      obj.rename = false
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

        Notification.show({
          title: '成功',
          type: 'success',
          msg: '移动文件成功',
          closeable: true
        })
      })
    }

    // 打开讨论 默认是关闭的
    $scope.discussOpened = false
    $scope.openUserDiscuss = function(obj) {
      if (!obj.is_preview) { //讨论权限
        return
      }
      $scope.discuss_file_id = obj.file_id
      $scope.discussOpened = true
    }

    //监听message 讨论文件file_id
    $scope.$on('message_file', function($event, message_file_id) {
      $scope.discuss_file_id = message_file_id
      $scope.discussOpened = true
    })

    $scope.stopPropagation = function($event, obj) {
      $event.stopPropagation()
      obj.checked = !obj.checked
    }

    //邀请协作人
    $scope.inviteTeamUsers = function($event, obj) {
      $event.stopPropagation()
      if (!obj.is_edit) { //无编辑权限
        return
      }
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users/template.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: 'App.Files.InviteTeamUsersController',
        resolve: {
          folder_id: function() {
            return obj.folder_id
          },
          folder_name: function() {
            return obj.folder_name
          },
          folder_permission: function() {
            return obj.permission
          }
        }
      })
    }

    //链接分享
    $scope.linkShare = function($event, obj) {
      $event.stopPropagation()
      if (!obj.is_getLink) { //无编辑权限
        return
      }
      var linkShareModal = $modal.open({
        templateUrl: 'src/app/files/link-share/template.html',
        windowClass: 'link-share',
        backdrop: 'static',
        controller: 'App.Files.LinkShareController',
        resolve: {
          obj: function() {
            return obj
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
      $scope.space_info = Users.getSpaceinfo()
      $scope.space_info.$promise.then(function(user_space) {
        var user_total_size = user_space.total_size;
        var user_used_size = user_space.used_size;
        $scope.user_unused_size = user_total_size - user_used_size;

        if ($scope.user_unused_size > 0) {
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
        } else {
          Notification.show({
            title: '上传失败',
            type: 'danger',
            msg: '您的剩余空间不够',
            closeable: false
          })
        }
      })
    }

    //检查预览的文件大小及类型
    function checkFileValid(obj) {
      var fileSize = obj.file_size;
      var fileType = Utils.getFileTypeByName(obj.file_name);
      if ('office' == fileType) {
        //office文档最大预览为10M
        if (fileSize > 10485760) {
          return false;
        }
      } else
      if ('pdf' == fileType) {
        //pdf设置最大预览为50M
        if (fileSize > 52428800) {
          return false;
        }
      }
      return true;
    }

    //文件预览
    $scope.previewFile = function(obj) {
      var validFile = checkFileValid(obj);
      if (validFile) {
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
      } else {
        Notification.show({
          title: '失败',
          type: 'danger',
          msg: '仅仅允许预览10MB以下文件。',
          closeable: false
        })
      }
    }

    //添加标签
    $scope.createTag = function(obj) {
      var createTagModal = $modal.open({
        templateUrl: 'src/app/files/create-tag/template.html',
        windowClass: 'create-tag',
        backdrop: false,
        controller: 'App.Files.CreateTagController',
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
    element.bind("keypress", function(event) {
      if (event.which === 13) {
        scope.$apply(function() {
          scope.$eval(attrs.ngEnter);
        });
        event.preventDefault();
      }
    });
  };
}).directive('focusMe', ['$timeout', '$parse',
  function($timeout, $parse) {
    return {
      scope: {
        'focus': '=focusMe'
      },
      link: function(scope, element) {
        scope.$watch('focus', function(value) {
          if (value === true) {
            $timeout(function() {
              element[0].focus();
            });
          }
        });
        element.bind('blur', function() {
          scope.focus = false
        })
      }
    };
  }
])