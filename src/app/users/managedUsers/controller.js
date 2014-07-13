angular.module('App.Users.ManagedUers').controller('App.Users.ManagedUers.Controller', function($scope, Users) {
    $scope.userList = Users.query()
    console.log($scope.userList)
})