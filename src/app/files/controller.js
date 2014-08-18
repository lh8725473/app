angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  'CONFIG',
  'Folders',
  'FolderAction',
  'Notification',
  function(
    $scope,
    $state,
    CONFIG,
    Folders,
    FolderAction,
    Notification
  ) {

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

    //Folder path
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
        if(obj.isFolder == 1){
          obj.folder = true
        }else{
          obj.folder = false
        }

        angular.forEach($scope.permission_key, function(key, index) {
          if(key == obj.permission){
            obj.permission = $scope.permission_value[index]
          }
        })
      })
    })
	
	  $scope.selectedAll = false

    $scope.selectedAllswitch = function(){
      angular.forEach($scope.objList, function(obj){
        obj.checked = !$scope.selectedAll
      })
    }

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

}])