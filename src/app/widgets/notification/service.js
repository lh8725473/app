angular.module('App.Widgets').service('Notification', function($modal) {
    var notificationModalController = function($scope, $modalInstance, notification) {
        $scope.notification = notification
        $scope.ok = function() {
            $modalInstance.close()
        }
    }
    return {
        show: function(notification) {
            var notificationModal = $modal.open({
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