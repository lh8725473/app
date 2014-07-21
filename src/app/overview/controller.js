angular.module('App.Overview').controller('App.Overview.Controller', function($scope, Users) {
	Users.getSpaceinfo().$promise.then(function(spaceinfo) {
		$scope.data = {
			series : ['usedSpace', 'freeSpace'],
			data : [{
				x : "usedSpace(GB)",
				y : [spaceinfo.used_size],
				"tooltip": spaceinfo.used_space
			}, {
				x : "freeSpace(GB)",
				y : [spaceinfo.total_size - spaceinfo.used_size]
			}]
		};
	});
	
	$scope.config = {
		title : 'UserSpace',
		tooltips : true,
		labels : false,
		mouseover : function() {
		},
		mouseout : function() {
		},
		click : function() {
		},
		legend : {
			display : true,
			//could be 'left, right'
			position : 'right'
		}
	};

	

})