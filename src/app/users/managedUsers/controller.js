angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function($scope, $modal, Users) {

    //userList data
    $scope.userList = Users.query();

    //userListGird action
    $scope.actionInPopup = '<button id="editBtn" type="button" class="btn btn-primary" ng-click="edit(row)" >Edit</button> '+
    						'<button id="deleteBtn" type="button" class="btn btn-primary" ng-click="delete(row)" >Delete</button>'
	
	//deleteUser
	$scope.delete = function (row){
		console.log("Here I need to know which row was selected " + row.entity.user_id);
		var deleteUserModal = $modal.open({
            templateUrl: 'src/app/users/managedUsers/delete-user-modal.html',
            controller: deleteModalController
        });
		
		deleteUserModal.result.then(function() {
            Users.delete({id:row.entity.user_id});
			for(var i = 0; i < $scope.userList.length; ++i){
				if($scope.userList[i].user_id == row.entity.user_id) break;
			}
			$scope.userList.splice(i, 1);
        })	
	}
	
	//delete window ctrl
	var deleteModalController = function($scope, $modalInstance) {  	
        $scope.ok = function(user_id) {
            $modalInstance.close();
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
	
	//editUser
    $scope.edit = function edit(row){
        console.log("Here I need to know which row was selected " + row.entity.user_id);
		$scope.updateuser = {
        	real_name : ''
        }
        $scope.updateuser.real_name = row.entity.real_name;
    	var updateUserModal = $modal.open({
            templateUrl: 'src/app/users/managedUsers/update-user-modal.html',
            controller: updateModalController,
            resolve: {
        		updateuser: function () {
         			return $scope.updateuser;
       			}
     		}
        });

        updateUserModal.result.then(function(updateuser) {
            Users.update({id:row.entity.user_id}, updateuser);
        })
    }
    
    //edit window ctrl
    var updateModalController = function($scope, $modalInstance, updateuser) {
    	$scope.updateuser = updateuser;
    	
        $scope.ok = function(updateuser) {
            $modalInstance.close(updateuser);
        };

        $scope.cancel = function() {
            $modalInstance.dismiss('cancel');
        };
    };
    
    $scope.gridOptions = {
        data: 'userList',
        selectedItems: [],
//      enableRowSelection : false,
        showSelectionCheckbox: true,
        columnDefs : [ {
            field : 'user_id',
            displayName : 'userId'
        }, {
            field : 'user_name',
            displayName : 'userName'
        }, {
            field : 'real_name',
            displayName : 'realName'
        }, {
            displayName : 'action',
            cellTemplate : $scope.actionInPopup
        } ]
    };

    //addUser window
    $scope.addUser = function() {
        var addUserModal = $modal.open({
            templateUrl: 'src/app/users/managedUsers/add-user-modal.html',
            controller: addUserModalController
        });

        addUserModal.result.then(function(user) {
            Users.create({}, user);
        })
    };

    //addUser window ctrl
    var addUserModalController = function($scope, $modalInstance) {
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