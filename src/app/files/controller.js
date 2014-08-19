angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  'CONFIG',
  'Folders',
  'FolderAction',
  'Notification',
  'Files',
  'DownLoadFile',
  '$modal',
  '$cookies',
  function(
    $scope,
    $state,
    CONFIG,
    Folders,
    FolderAction,
    Notification,
    Files,
    DownLoadFile,
    $modal,
    $cookies
  ) {
	
	//权限
    $scope.permission_key = CONFIG.PERMISSION_KEY
    $scope.permission_value = CONFIG.PERMISSION_VALUE

    $scope.permissions = []
    angular.forEach($scope.permission_key, function(key, index) {
      var permissionMap = {
        key : key,
        value : $scope.permission_value[index]
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

    $scope.objList.$promise.then(function(objList){
      angular.forEach(objList, function(obj){
      	obj.checked = false
      	obj.rename = false
        if(obj.isFolder == 1){
          obj.folder = true
        }else{
          obj.folder = false
        }
		
		//文件图像
		
        angular.forEach($scope.permission_key, function(key, index) {
          if(key == obj.permission){
            obj.permission = $scope.permission_value[index]
          }
        })
      })
    })
	
	//全部选择状态
	$scope.selectedAll = false

    $scope.selectedAllswitch = function(){
      angular.forEach($scope.objList, function(obj){
        obj.checked = !$scope.selectedAll
      })
    }
	
	//新建文件夹
    $scope.showCreateFolderDiv = false
    $scope.showCreateFolder = function(){
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.cancleCreate = function(){
      $scope.showCreateFolderDiv = !$scope.showCreateFolderDiv
    }
    $scope.createFolder = function(createFolderName){
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
	$scope.onRightClick = function(obj){
		angular.forEach($scope.objList, function(obj){
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
		if ($scope.objList[i].isFolder == 1) {//文件夹
			FolderAction.deleteFolder({
				folder_id : $scope.objList[i].folder_id
			}).$promise.then(function() {
				$scope.objList.splice(i, 1)
				Notification.show({
					title : '成功',
					type : 'success',
					msg : '创建文件夹成功',
					closeable : true
				})
			})
		} else {//文件
			Files.deleteFile({
				file_id : $scope.objList[i].file_id
			}).$promise.then(function() {
				$scope.objList.splice(i, 1)
				Notification.show({
					title : '成功',
					type : 'success',
					msg : '创建文件夹成功',
					closeable : true
				})
			})
		}
	}
	
	//下载单个文件或者文件夹
	$scope.dowloadFile = function(){
		var hiddenIframeID = 'hiddenDownloader'
		var iframe = $('#' + hiddenIframeID)[0]
		if (iframe == null) {
			iframe = document.createElement('iframe')
			iframe.id = hiddenIframeID
			iframe.style.display = 'none'
			document.body.appendChild(iframe)
		}
		iframe.src = CONFIG.API_ROOT + '/file/get/'+ $scope.checkedObj.file_id + '?token='+ $cookies.accessToken
	}
	
	//重命名文件或文件夹
	$scope.renameInputValue = ""
	$scope.renameFileForm = function(){
		$scope.checkedObj.rename = true
		if ($scope.checkedObj.isFolder == 1) {//文件夹
			$scope.renameInputValue = $scope.checkedObj.folder_name	
		}else{
			$scope.renameInputValue = $scope.checkedObj.file_name
		}
	}
	
	$scope.renameFile = function(renameInputValue){
		if ($scope.checkedObj.isFolder == 1) {//文件夹
			FolderAction.updateFolder({
				folder_id: $scope.checkedObj.folder_id
			},{
				folder_name : renameInputValue
			}).$promise.then(function() {
				$scope.checkedObj.folder_name = renameInputValue
				$scope.checkedObj.rename = false;
			})
		}else{
			Files.updateFile({
				file_id: $scope.checkedObj.file_id
			},{
				file_name : renameInputValue
			}).$promise.then(function() {
				$scope.checkedObj.file_name = renameInputValue
				$scope.checkedObj.rename = false;
			})
		}
	}
	
	$scope.cancleRenameFile = function(){
		$scope.checkedObj.rename = false
	}
	
	
	//移动文件或者文件夹
	$scope.moveFile = function() {
		var addUserModal = $modal.open({
			templateUrl : 'src/app/files/move-file.html',
			windowClass : 'move-file-modal-view',
			backdrop : 'static',
			controller : moveFileModalController,
			resolve : {
				fileid : function() {
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
			"label" : "User",
			"id" : "role1",
			"children" : [{
				"label" : "subUser1",
				"id" : "role11",
				"children" : []
			}, {
				"label" : "subUser2",
				"id" : "role12",
				"children" : [{
					"label" : "subUser2-1",
					"id" : "role121",
					"children" : [{
						"label" : "subUser2-1-1",
						"id" : "role1211",
						"children" : []
					}, {
						"label" : "subUser2-1-2",
						"id" : "role1212",
						"children" : []
					}]
				}]
			}]
		}, {
			"label" : "Admin",
			"id" : "role2",
			"children" : []
		}, {
			"label" : "Guest",
			"id" : "role3",
			"children" : []
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
	
}])