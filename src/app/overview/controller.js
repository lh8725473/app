angular.module('App.Overview').controller('App.Overview.Controller', [
	'$scope',
	'Users',
	function(
		$scope,
		Users
	) {
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
			colors : ['rgb(73,66,204)','rgb(0,128,0)'],
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
	}
])