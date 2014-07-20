angular.module('App.Widgets').factory('Notification', function($modal) {
    var notificationModalController = function($scope, $modalInstance, $timeout, notification) {
        $scope.notification = notification
        if (notification.closeable) {
            $scope.close = function() {
                $modalInstance.close()
            }
        } else {
            $timeout(function () {
                $modalInstance.close()
            }, 2000)
        }
    }
    return {
        show: function(notification) {
            var notificationModal = $modal.open({
                backdrop: false,
                templateUrl: 'src/app/widgets/notification/template.html',
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
})