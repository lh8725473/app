angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  '$upload',
  'CONFIG',
  'Folders',
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
    $upload,
    CONFIG,
    Folders,
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

    //fileList data
    $scope.objList = Folders.getObjList({
      folder_id: folderId
    })

    $scope.objList.$promise.then(function(objList) {
      angular.forEach(objList, function(obj) {
        obj.checked = false
        obj.rename = false
        if (obj.isFolder == 1) {
          obj.folder = true
        } else {
          obj.folder = false
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
            obj.permission = $scope.permission_value[index]
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

    //右键菜单
    $scope.onRightClick = function(obj) {
      angular.forEach($scope.objList, function(obj) {
        obj.checked = false
      })
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
            msg: '创建文件夹成功',
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
        templateUrl: 'src/app/files/move-file.html',
        windowClass: 'move-file-modal-view',
        backdrop: 'static',
        controller: moveFileModalController,
        resolve: {
          fileid: function() {
            return $scope.checkedObj.file_id
          }
        }
      })
    }

    //moveFile window ctrl
    var moveFileModalController = [
      '$scope',
      '$modalInstance',
      'fileid',
      function(
        $scope,
        $modalInstance,
        fileid
      ) {

        $scope.treedata = [{
          "label": "User",
          "id": "role1",
          "children": [{
            "label": "subUser1",
            "id": "role11",
            "children": []
          }, {
            "label": "subUser2",
            "id": "role12",
            "children": [{
              "label": "subUser2-1",
              "id": "role121",
              "children": [{
                "label": "subUser2-1-1",
                "id": "role1211",
                "children": []
              }, {
                "label": "subUser2-1-2",
                "id": "role1212",
                "children": []
              }]
            }]
          }]
        }, {
          "label": "Admin",
          "id": "role2",
          "children": []
        }, {
          "label": "Guest",
          "id": "role3",
          "children": []
        }];


        $scope.$watch('abc.currentNode', function(newObj, oldObj) {
          if ($scope.abc && angular.isObject($scope.abc.currentNode)) {
            console.log('Node Selected!!');
            console.log($scope.abc.currentNode);
          }
        }, true);

        $scope.ok = function() {
          console.log(currentNode)
          $modalInstance.close(fileid)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //邀请协作人
    $scope.inviteTeamUsers = function(obj) {
      var addUserModal = $modal.open({
        templateUrl: 'src/app/files/invite-team-users.html',
        windowClass: 'invite-team-users',
        backdrop: 'static',
        controller: inviteTeamUsersModalController,
        resolve: {
          folderid: function() {
            return obj.folder_id
          }
        }
      })
    }

    //邀请协作人
    var inviteTeamUsersModalController = [
      '$scope',
      '$modalInstance',
      'folderid',
      'CONFIG',
      function(
        $scope,
        $modalInstance,
        folderid,
        CONFIG
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
		
		$scope.selectedPermissionKey = "0111111"
		$scope.selectedPermissionValue = "编辑者"
		
		$scope.selectedPermission = function(value){
			$scope.selectedPermissionValue = value
		}
		
		$scope.deleteSelected = function(obj){
			for (var i = 0; i < $scope.invitedList.userList; ++i) {
        		if ($scope.invitedList.userList[i] == obj)
          			break
      		}
			$scope.invitedList.userList.splice(i, 1)
		}
		
		
		$scope.invitedList = {
			groupList : [],
			userList : ["大龙一号","小龙二号","大龙三号"]
		}
		
		$scope.inviteBypress = function(inputValue){
			$scope.invitedList.userList.push(inputValue)
			inputValue = ''
		}

        $scope.ok = function() {
          console.log(currentNode)
          $modalInstance.close(folderid)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
//  $scope.showDiscuss = function(){
//  	$scope.userDiscussList = UserDiscuss.getUserDiscussList({
//  		obj_id : $scope.checkedObj.file_id
//  	})
////  	userDiscussList.$promise.then(function() {
////  		
////  	})
//  }    
    // upload file
    var uploadModalController = [
      '$scope',
      '$rootScope',
      '$modalInstance',
      function(
        $scope,
        $rootScope,
        $modalInstance
      ) {

        function File(file) {
          this.file = file
          this.progress = 0
        }
        // upload file
        $scope.onFileSelect = function($files) {
          $modalInstance.dismiss('cancel')
          for (var i = 0; i < $files.length; i++) {
            var file = $files[i];
            var f = new File(file);
            $rootScope.$broadcast('addFile', f);
            (function(f){
              $scope.upload = $upload.upload({
                url: CONFIG.API_ROOT + '/file/create?token=f98716ed6be3e177a7e7ddf1fa182aac',
                method: 'POST',
                withCredentials: true,
                data: {
                  file_name: file.name
                },
                file: file,
                fileFormDataName: 'file_content',
              }).progress(function(evt) {
                f.progress = parseInt(100.0 * evt.loaded / evt.total)
                console.log('percent: ' + f.progress);
              }).success(function(data, status, headers, config) {
                f.progress = 100
                console.log(data);
              });
            })(f)
          }
        };

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    //邀请协作人
    $scope.upload = function() {
      var uploadModal = $modal.open({
        templateUrl: 'src/app/files/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: uploadModalController,
        resolve: {}
      })
    }
  }
]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if(event.which === 13) {
                scope.$apply(function (){
                    scope.$eval(attrs.ngEnter);
                });

                event.preventDefault();
            }
        });
    };
});
