angular.module('App.Users.ManagedUers').controller('App.Users.ManagedUers.Controller', function ($scope, Users) {
	$scope.userList = Users.query();
    $scope.gridOptions = { 
    	data: 'userList',
    	selectedItems: [],
    	showSelectionCheckbox: true
    };
    
    $scope.addUser = function(){ 
    	alert("addUser");
    };
    
    $scope.bulkEdit = function(){ 
    	alert("bulkEdit");
    };
    
    $scope.bulkadd = function(){ 
    	alert("bulkadd");
    };
    
    $scope.exportUser = function(){ 
    	alert("exportUser");
    };
})