angular.module('App.Files').controller('App.Files.Controller', [
  '$scope',
  '$state',
  'CONFIG',
  'Folders',
  function(
    $scope,
    $state,
    CONFIG,
    Folders
  ) {
    //userList data
    var folderId = $state.params.folderId || 0;
    $scope.objList = Folders.getObjList({
      folder_id: folderId
    })
}])