angular.module('App.Sidebar').controller('App.Sidebar.Controller', function ($scope, $rootScope, $location) {
	$rootScope.location = $location;
})