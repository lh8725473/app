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

        // FCUK code
        var treeId = $scope.treeId = 'abc';
        $scope[treeId] = $scope[treeId] || {};

        //if node head clicks,
        $scope[treeId].selectNodeHead = $scope[treeId].selectNodeHead || function(selectedNode) {

          //Collapse or Expand
          selectedNode.collapsed = !selectedNode.collapsed;
        };

        //if node label clicks,
        $scope[treeId].selectNodeLabel = $scope[treeId].selectNodeLabel || function(selectedNode) {

          //remove highlight from previous node
          if ($scope[treeId].currentNode && $scope[treeId].currentNode.selected) {
            $scope[treeId].currentNode.selected = undefined;
          }

          //set highlight to selected node
          selectedNode.selected = 'selected';

          //set currentNode
          $scope[treeId].currentNode = selectedNode;
        };
        // FCUK code end

        $scope.$watch('abc.currentNode', function(newObj, oldObj) {
          if ($scope.abc && angular.isObject($scope.abc.currentNode)) {
            console.log('Node Selected!!');
            console.log($scope.abc.currentNode);
          }
        }, false);

        $scope.ok = function() {
          console.log(currentNode)
          $modalInstance.close(fileid)
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]

    // 打开讨论 默认是关闭的
    $scope.discussOpened = false
    $scope.openUserDiscuss = function(file_id) {
      $scope.discuss_file_id = file_id
      $scope.discussOpened = true
    }

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
        'Cloud',
        'folderid',
        'CONFIG',
        '$timeout',
        "Share",
        function(
          $scope,
          $modalInstance,
          Cloud,
          folderid,
          CONFIG,
          $timeout,
          Share
        ) {
          $scope.broad = false
          //分享文件夹ID
          $scope.folderid = folderid
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

          //选择权限dropdown
          $scope.permissionOpen = false

          //选择权限
          $scope.selectedPermission = function(value) {
            $scope.selectedPermissionValue = value
            $scope.permissionOpen = !$scope.permissionOpen
            angular.forEach($scope.permission_value, function(p_value, index) {
              if (p_value == value) {
                $scope.selectedPermissionKey = $scope.permission_key[index]
              }
            })
          }

          //删除选中的人员
          $scope.deleteSelectedUser = function(user) {
            for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
              if ($scope.invitedList.userList[i].user_id == user.user_id || $scope.invitedList.userList[i].email == user.email)
                user.selected = false
              break
            }
            $scope.invitedList.userList.splice(i, 1)
          }

          //删除选中的组
          $scope.deleteSelectedGroup = function(group) {
            for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
              if ($scope.invitedList.groupList[i].group_id == group.group_id)
                group.selected = false
              break
            }
            $scope.invitedList.groupList.splice(i, 1)
          }

          //协作 人员和组的接口
          $scope.cloudUserList = Cloud.cloudUserList({
            folder_id: $scope.folderid
          })

          $scope.cloudUserList.$promise.then(function(cloudUser) {
            $scope.userList = cloudUser.list.users
            $scope.groupList = cloudUser.list.groups

            angular.forEach($scope.userList, function(user) {
              user.selected = false
            })

            angular.forEach($scope.groupList, function(group) {
              group.show = false
              group.selected = false
            })
          })

          //组是否显示人员
          $scope.changeGroupshow = function(group) {
            group.show = !group.show
          }

          //已邀请的 组和人员
          $scope.invitedList = {
            groupList: [],
            userList: []
          }

          //外部联系人输入框
          $scope.inviteInputValue = ""

          //输入框输入增加协作人或组
          $scope.inviteBypress = function(inviteInputValue) {
            var user = {
              real_name: inviteInputValue,
              email: inviteInputValue
            }
            $scope.invitedList.userList.push(user)
            $scope.inviteInputValue = ''
          }

          //右侧列表是否显示
          $scope.showGRroupUser = function() {
            $scope.broad = !$scope.broad
          }

          //右侧列表选择协作人或组
          $scope.inviteBySelect = function(groupOrUser, selected) {
            if (selected) { //取消组或者协作人
              if (groupOrUser.group_id) { //取消的是组
                angular.forEach($scope.groupList, function(group) {
                  if (groupOrUser.group_id == group.group_id) {
                    group.selected = false;
                  }
                })
                for (var i = 0; i < $scope.invitedList.groupList.length; ++i) {
                  if ($scope.invitedList.groupList[i].group_id == groupOrUser.group_id)
                    break
                }
                $scope.invitedList.groupList.splice(i, 1)
              } else { //取消的是用户
                angular.forEach($scope.userList, function(user) {
                  if (groupOrUser.user_id == user.user_id) {
                    user.selected = false;
                  }
                })
                for (var i = 0; i < $scope.invitedList.userList.length; ++i) {
                  if ($scope.invitedList.userList[i].user_id == groupOrUser.user_id)
                    break
                }
                $scope.invitedList.userList.splice(i, 1)
              }
            } else { //选中列表中组或者协作人
              if (groupOrUser.group_id) { //选中的是组
                $scope.invitedList.groupList.push(groupOrUser)
              } else { //选中的是用户
                $scope.invitedList.userList.push(groupOrUser)
              }
            }

          }

          //邀请联系人comment
          $scope.comment = "你好，我想在全协通中与你分享文件夹"

          //发送邀请
          $scope.createShare = function() {
            var toUserList = []
            var toGroupList = []
            angular.forEach($scope.invitedList.userList, function(user) {
              if (user.user_id) { //已有联系人
                var to_user = {
                  to_user_id: user.user_id
                }
                toUserList.push(to_user)
              } else { //没有的联系人 （通过邮件邀请）
                var to_user = {
                  email: user.email
                }
                toUserList.push(to_user)
              }
            })
            angular.forEach($scope.invitedList.groupList, function(group) {
              var to_group = {
                to_group_id: group.group_id
              }
              toGroupList.push(to_group)
            })
            Share.createShare({}, {
              share_type: "to_all",
              permission: $scope.selectedPermissionKey,
              obj_type: "folder",
              comment: $scope.comment,
              obj_id: $scope.folderid,
              list: {
                users: toUserList,
                groups: toGroupList
              }
            }).$promise.then(function(resUser) {
              $modalInstance.close()
            })
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
    
    //链接分享
    $scope.linkShare = function(obj){
    	var linkShareModal = $modal.open({
        	templateUrl: 'src/app/files/link-share.html',
        	windowClass: 'link-share',
        	backdrop: 'static',
        	controller: linkShareModalController,
        	resolve: {
          		obj: function() {
            		return obj
          		}
        	}
      	})
    }
    
    var linkShareModalController = [
      '$scope',
      '$modalInstance',
      'obj',
      'Share',
      function(
        $scope,
        $modalInstance,
        obj,
        Share
      ) {
		
		$scope.today = function() {
			$scope.dt = new Date();
		};
		$scope.today();

		$scope.clear = function() {
			$scope.dt = null;
		};

		// Disable weekend selection
		$scope.disabled = function(date, mode) {
			return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6 ) );
		};

		$scope.toggleMin = function() {
			$scope.minDate = $scope.minDate ? null : new Date();
		};
		$scope.toggleMin();

		$scope.open = function($event) {
			$event.preventDefault();
			$event.stopPropagation();

			$scope.opened = true;
		};

		$scope.dateOptions = {
			formatYear : 'yy',
			startingDay : 1
		};

		$scope.initDate = new Date('2016-15-20');
		$scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
		$scope.format = $scope.formats[1];
		
		//链接分享权限
		$scope.linkSharePermissionValue = "仅预览"
		
		//链接分享权限List
		$scope.linkSharePermissionValueList = ["仅预览", "仅上传", "可预览和下载", "可预览、下载和上传"]
		
		//是否设置访问权限
		$scope.linkSharePasswordShow = false
		
		//链接分享访问密码输入框type
		$scope.linkSharePasswordType = 'password'
		
		//显示或者隐藏密码
		$scope.changeLinkSharePasswordType = function(){
			if($scope.linkSharePasswordType == 'password'){
				$scope.linkSharePasswordType = 'text'
			}else{
				$scope.linkSharePasswordType = 'password'
			}
		}
		
		//链接分享选择权限
		$scope.changeLinkSharePermission = function(value){
			$scope.linkSharePermissionValue = value
		}
		
		//链接说明
		$scope.comment = ""
		
		//生成链接
		$scope.createLinkShare = function(){
			$scope.linkCreateOrSend = !$scope.linkCreateOrSend
			Share.getLink({},{
				comment : "124554",
				expiration : "2016-08-1",
				obj_id : 17,
				obj_name : "ogc",
				obj_type : "folder",
				password : 213421321,
				permission : 0000111
			}).$promise.then(function(linkShare) {
				$scope.share_url = linkShare.share_url
				$scope.code_src = linkShare.code_src
			})
		}
		
		//生成链接与发送链接邀请form切换
		$scope.linkCreateOrSend = true;
		
		//返回修改
		$scope.backToCreate = function(){
			$scope.linkCreateOrSend = !$scope.linkCreateOrSend
		}
		
		//复制链接地址至剪切板
		$scope.getTextLinkUrl = function(){
			alert("链接已复制到剪切板")
			return $scope.share_url
		}
		
        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
      }
    ]
    
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
            (function(f) {
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

    //上传
    $scope.upload = function() {
      var uploadModal = $modal.open({
        templateUrl: 'src/app/files/modal-upload.html',
        windowClass: 'modal-upload',
        backdrop: 'static',
        controller: 'uploadModalController',
        resolve: {}
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