angular.module('App.UploadProgressDialog').controller('App.UploadProgressDialog.Controller', [
  '$scope',
  '$upload',
  '$cookies',
  '$rootScope',
  '$q',
  '$state',
  'CONFIG',
  'Utils',
  function(
    $scope,
    $upload,
    $cookies,
    $rootScope,
    $q,
    $state,
    CONFIG,
    Utils
  ) {
    $scope.shown = false
    $scope.isMax = true

    $scope.files = []

    $scope.$on('uploadFiles', function($event, $files) {
      $scope.shown = true
      $scope.isMax = true
      //上传所在文件夹
      var folder_id = $state.params.folderId || 0;
      for (var i = 0; i < $files.length; i++) {
        var file = $files[i];
        file.progress = 0;
        file.fomateSize = Utils.formateSize(file.size);
        (function(file) {
          file.upload = $upload.upload({
            url: CONFIG.API_ROOT + '/file/create?token=' + $cookies.accessToken,
            method: 'POST',
            withCredentials: true,
            data: {
              file_name: file.name,
              folder_id: folder_id
            },
            file: file,
            fileFormDataName: 'file_content',
          }).progress(function(evt) {
            file.progress = parseInt(100.0 * evt.loaded / evt.total)
          }).success(function(data, status, headers, config) {
            file.progress = 100
          });
        })(file);
        $scope.files.push(file)
        $q.all($scope.files.map(function(file) {
          return file.upload
        })).finally(function() {
          $rootScope.$broadcast('uploadFilesDone');
        })
      }
    })

    $scope.max = function() {
      $scope.isMax = true
    }

    $scope.min = function() {
      $scope.isMax = false
    }

    $scope.hide = function() {
      $scope.shown = false
    }


  }
])