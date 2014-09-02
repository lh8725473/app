angular.module('App.Trash').controller('App.UploadProgressDialog.Controller', [
  '$scope',
  'CONFIG',
  'Utils',
  function(
    $scope,
    CONFIG,
    Utils
  ) {
    $scope.shown = false
    $scope.isMax = true

    $scope.files = []

    $scope.$on('addFile', function ($event, file) {
      file.file.fomateSize = Utils.formateSize(file.file.size)

      $scope.files.push(file)
      $scope.shown = true
      $scope.isMax = true
    })

    $scope.max = function () {
      $scope.isMax = true
    }

    $scope.min = function () {
      $scope.isMax = false
    }

    $scope.hide = function () {
      $scope.shown = false
    }


  }
])