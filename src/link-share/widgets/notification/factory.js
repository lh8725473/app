angular.module('App.Widgets').factory('Notification', [
  '$modal',
  function(
    $modal
  ) {
    var notificationModalController = [
      '$scope',
      '$modalInstance',
      '$timeout',
      'notification',
      function(
        $scope,
        $modalInstance,
        $timeout,
        notification
      ) {
        $scope.notification = notification
        if (notification.closeable) {
          $scope.close = function() {
            $modalInstance.close()
          }
          $timeout(function () {
            $modalInstance.close()
          }, 2000)
        } else {
          $timeout(function () {
            $modalInstance.close()
          }, 2000)
        }
      }
    ]
    return {
      show: function(notification) {
        var notificationModal = $modal.open({
          backdrop: false,
          templateUrl: 'src/admin/widgets/notification/template.html',
          windowClass: 'notification-modal-view',
          controller: notificationModalController,
          resolve: {
            notification: function() {
              return notification
            }
          }
        })
      }
    }
  }
])