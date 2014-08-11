angular.module('App.Resources').factory('OverView', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/cloud/:action', {}, {
      loginCount: {
        method: "GET",
        params: {
          action: 'loginCount'
        }
      },
      loginRank: {
        method: "GET",
        params: {
          action: 'loginRank'
        },
        isArray: true
      },
      loginTrend: {
        method: "GET",
        params: {
          action: 'loginTrend'
        }
      },
      spaceTrend: {
        method: "GET",
        params: {
          action: 'spaceTrend'
        }
      },
      spaceRank: {
        method: "GET",
        params: {
          action: 'spaceRank'
        },
        isArray: true
      },
      spaceInfo: {
        method: "GET",
        params: {
          action: 'spaceInfo'
        }
      }
    })
  }
])