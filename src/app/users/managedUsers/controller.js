angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function($scope, $modal, Users) { 	
    $scope.userList = Users.query()
    $scope.gridOptions = {
        data: 'userList',
        selectedItems: [],
        showSelectionCheckbox: true
    };
	
	$scope.items = ['item1', 'item2', 'item3'];
	
	$scope.addUser = function(size) {
		var modalInstance = $modal.open({
			templateUrl : 'src/app/users/managedUsers/add-user-modal.html',
			controller : ModalInstanceCtrl,
			size : size,
			resolve : {
				items : function() {
					return $scope.items;
				}
			}
		});

		modalInstance.result.then(function(selectedItem) {
			$scope.selected = selectedItem;
		}, function() {
			$log.info('Modal dismissed at: ' + new Date());
		});
	};
	
	
	var ModalInstanceCtrl = function($scope, $modalInstance, items) {

		$scope.items = items;
		$scope.selected = {
			item : $scope.items[0]
		};

		$scope.ok = function() {
			$modalInstance.close($scope.selected.item);
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
    
	//create user
	$scope.createUser = function(json) {
//      var json = {
//			"user_name" : "test1123212697897813",
//			"real_name" : "测试",
//			"phone" : "13516251452",
//			"email" : "test1123213211267821@gmail.com",
//			"password" : "12345612312312321",
//			"group_id" : "1"
//		}

		Users.create({},json);
    };
    
    //update user
	$scope.updateUser = function(userId, json) {      
//		var json = {
//			"real_name" : "姓名",
//			"phone" : "13512345678",
//			"total_space" : "20",
//			"password" : "123456",
//			"role_id" : "1",
//			"group_id" : "2"
//		}

		Users.update({id : userId},json);
    };
    
    //delete user
	$scope.deleteUser = function(userId) {      
		Users.delete({id : userId});
    };
    
})
