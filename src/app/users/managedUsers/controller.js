angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function($scope, $modal, Users) {

    //userList data
    $scope.userList = Users.query();

    //userListGird
    $scope.gridOptions = {
        data: 'userList',
        selectedItems: [],
        showSelectionCheckbox: true
    };

    //addUser window
    $scope.addUser = function() {
        var modalInstance = $modal.open({
            templateUrl: 'src/app/users/managedUsers/add-user-modal.html',
            controller: ModalInstanceCtrl
        });

        modalInstance.result.then(function(user) {
            Users.create({}, user);
        })
    };

    //addUser window ctrl
    var ModalInstanceCtrl = function($scope, $modalInstance) {
        $scope.ok = function(user) {
            $modalInstance.close(user);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };

    $scope.bulkEdit = function() {
        alert("bulkEdit");
    };

    $scope.bulkadd = function() {
        alert("bulkadd");
    };

    $scope.exportUser = function() {
        alert("exportUser");
    };

    //update user server
    $scope.updateUser = function(userId, user) {
        Users.update({
            id: userId
        }, user);
    };

    //delete user server
    $scope.deleteUser = function(userId) {
        Users.delete({
            id: userId
        });
    };

})