angular.module('App.Overview').controller('App.Overview.Controller', [
	'$scope',
	'Users',
	'OverView',
	function(
		$scope,
		Users,
		OverView
	) {
		OverView.loginCount().$promise.then(function(loginCount) {
			$scope.loginCountData = {
				series : [],
				data : [{
					x : "过去一天",
					y : [parseInt(loginCount.last_day)],
					"tooltip": parseInt(loginCount.last_day)
				}, {
					x : "过去一周",
					y : [parseInt(loginCount.last_week)]
				}, {
					x : "过去一月",
					y : [parseInt(loginCount.last_month)]
				}]
			};
		})

		$scope.loginCountConfig = {
			title : '活跃用户',
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
		
		OverView.loginRank().$promise.then(function(loginRank) {
			var data = []
			angular.forEach(loginRank, function(rank){
				var rankMap = {
					x : rank.real_name,
					y : [parseInt(rank.used_size)]
				}
				data.push(rankMap)
			})
			$scope.spaceRankData = {
				series : [],
				data : data
			};
			$scope.spaceRankData = {
				series : [],
				data : data
			};
		})

		$scope.spaceRankConfig = {
			title : '历史活动',
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
		
		OverView.loginTrend().$promise.then(function(loginTrend) {
			var data = []
			angular.forEach(loginTrend, function(value, key){
				var maps = {
					x : key,
					y : [value]
				}
			  data.push(maps)
			})
			$scope.loginTrendData = {
				series : ['2012', '2014'],
				data : data
			};
		})

		$scope.loginTrendConfig = {
  			"labels": false,
  			"title": "Products",
  			"legend": {
    			"display": true,
    			"position": "right"
  			},
  			"innerRadius": "",
  			"lineLegend": "traditional"
		}
		
		OverView.spaceTrend().$promise.then(function(spaceTrend) {
			var data = []
			angular.forEach(spaceTrend, function(value, key){
				var maps = {
					x : key,
					y : [value.used_size]
				}
			  data.push(maps)
			})
			$scope.spaceTrendData = {
				series : ['2012', '2014'],
				data : [{
					x : '2000',
					y : [1]
				},
				{
					x : '2001',
					y : [5]
				},
				{
					x : '2002',
					y : [20]
				},
				{
					x : '2003',
					y : [12]
				},
				{
					x : '2004',
					y : [50]
				},
				{
					x : '2005',
					y : [30]
				},
				{
					x : '2006',
					y : [40]
				},
				{
					x : '2007',
					y : [16]
				},
				{
					x : '2008',
					y : [26]
				},
				{
					x : '2009',
					y : [69]
				},
				{
					x : '2010',
					y : [78]
				},
				{
					x : '2011',
					y : [125]
				},
				{
					x : '2012',
					y : [130]
				},
				{
					x : '2013',
					y : [50]
				},
				{
					x : '2014',
					y : [78]
				},
				{
					x : '2015',
					y : [49]
				},
				{
					x : '2016',
					y : [90]
				},
				{
					x : '2017',
					y : [66]
				},
				{
					x : '2018',
					y : [88]
				},
				{
					x : '2019',
					y : [55]
				},
				{
					x : '2020',
					y : [11]
				},
				{
					x : '2021',
					y : [9]
				},
				{
					x : '2022',
					y : [33]
				},
				{
					x : '2023',
					y : [19]
				},
				{
					x : '2024',
					y : [17]
				},
				{
					x : '2025',
					y : [44]
				}
					
				]
			};
		})

		$scope.spaceTrendConfig = {
  			"labels": false,
  			"title": "Products",
  			"legend": {
    			"display": true,
    			"position": "right"
  			},
  			"innerRadius": "",
  			"lineLegend": "traditional"
		}
		
		OverView.spaceRank().$promise.then(function(spaceRank) {
			var data = []
			angular.forEach(spaceRank, function(rank){
				var rankMap = {
					x : rank.real_name,
					y : [parseInt(rank.used_size)]
				}
				data.push(rankMap)
			})
			$scope.spaceRankData = {
				series : [],
				data : data
			};
		})

		$scope.spaceRankConfig = {
			title : '活跃用户空间',
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



		 Users.getSpaceinfo().$promise.then(function(spaceinfo) {
		 	$scope.data = {
		 		series : [],
		 		data : [{
		 			x : "used(GB)",
		 			y : [spaceinfo.used_size],
		 			"tooltip": spaceinfo.used_size
		 		}, {
		 			x : "free(GB)",
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