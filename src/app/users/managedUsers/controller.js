angular.module('App.Users.ManagedUsers').controller('App.Users.ManagedUsers.Controller', function($scope, $modal, Users) {
    $scope.userList = Users.query()
    $scope.gridOptions = {
        data: 'userList.result',
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
})