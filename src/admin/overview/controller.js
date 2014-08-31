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
      $scope.loginCountConfig = {
        options: {
          chart: {
            type: 'column'
          }
        },
        title: {
          text: '过去一段时间的登录次数'
        },
        xAxis: {
          categories: ['过去一天', '过去一周', '过去一月']
        },
        yAxis: {
          title: {
            text: null
          }
        },
        series: [{
          name: '过去一段时间的登录次数',
          data: [
            [parseInt(loginCount.last_day)],
            [parseInt(loginCount.last_week)],
            [parseInt(loginCount.last_month)]
          ]
        }],
        credits: {
          enabled: false
        }
      }
    })

    OverView.loginRank().$promise.then(function(loginRank) {
      var categories = []
      var data = []
      angular.forEach(loginRank, function(rank) {
        categories.push(rank.real_name)
        data.push(parseInt(rank.login_count))
      })

      $scope.loginRankConfig = {
        options: {
          chart: {
            type: 'column'
          }
        },
        title: {
          text: '活跃用户'
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: null
          }
        },
        series: [{
          name: '登陆次数',
          data: data
        }],
        credits: {
          enabled: false
        }
      }
    })

    OverView.loginTrend().$promise.then(function(loginTrend) {
      var categories = []
      var data = []
      angular.forEach(loginTrend, function(value, key) {
        categories.push(key)
        data.push(parseInt(value))
      })

      $scope.loginTrendConfig = {
        title: {
          text: '登录变化'
        },
        xAxis: {
          categories: [2014-10-1,2014-6-1]
        },
        yAxis: {
          title: {
            text: null
          }
        },
        series: [{
          name: '登录变化',
          data: [1,2,3,4,5,6,10,5,16]
        }],
        credits: {
          enabled: false
        }
      }
    })

    OverView.spaceTrend().$promise.then(function(spaceTrend) {
      var categories = []
      var data = []
      angular.forEach(spaceTrend, function(value, key) {
        if (key != '$promise' && key != '$resolved') {
          categories.push(key)
          data.push(parseInt(value.used_size))
        }
      })

      $scope.spaceTrendConfig = {
        title: {
          text: '用量变化'
        },
        xAxis: {
          type: 'datetime',
          pointStart: Date.UTC(2014, 0, 1)
        },
        yAxis: {
            title: {
                text: '用量'
            },
            min: 0
        },
        series: [{
          name: '用量变化',
          data: [29.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4],
          pointInterval: 24 * 3600 * 1000
        }]
      }
    })

    OverView.spaceRank().$promise.then(function(spaceRank) {
      var categories = []
      var data = []
      angular.forEach(spaceRank, function(rank) {
        categories.push(rank.real_name)
        data.push(parseInt(rank.used_size))
      })

      $scope.spaceRankConfig = {
        options: {
          chart: {
            type: 'column'
          }
        },
        title: {
          text: '使用空间最多的五位用户'
        },
        xAxis: {
          categories: categories
        },
        yAxis: {
          title: {
            text: null
          }
        },
        series: [{
          name: '使用空间最多的五位用户',
          data: data
        }],
        credits: {
          enabled: false
        }
      }
    })

    OverView.spaceInfo().$promise.then(function(spaceinfo) {
      $scope.UserSpaceConfig = {
      	chart: {
            plotBackgroundColor: null,
            plotBorderWidth: 1,//null,
            plotShadow: false
        },
        title: {
            text: '已用团队空间'
        },
        tooltip: {
            pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
            pie: {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: true,
                    format: '<b>{point.name}</b>: {point.percentage:.1f} %',
                    style: {
                        color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'green'
                    }
                }
            }
        },
        series: [{
            type: 'pie',
            name: '空间',
            data: [
              ['剩余空间', spaceinfo.total_size - spaceinfo.used_size],
              ['已用空间', spaceinfo.used_size]
            ]
        }]
      }
    });
  }
])