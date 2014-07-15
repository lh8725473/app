angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function($scope, $modal, Users) { 	
    var that = $scope;
    
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
			templateUrl : 'src/app/users/managedUsers/add-user-modal.html',
			controller : ModalInstanceCtrl
		});	
	};
	
	//addUser window ctrl
	var ModalInstanceCtrl = function($scope, $modalInstance) {
		$scope.ok = function(user) {
			that.createUser(user);
			$modalInstance.close();
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
    
	//create user server
	$scope.createUser = function(json) {
		Users.create({},json);
    };
    
    //update user server
	$scope.updateUser = function(userId, json) {
		Users.update({id : userId},json);
    };
    
    //delete user server
	$scope.deleteUser = function(userId) {      
		Users.delete({id : userId});
    };
    
})
