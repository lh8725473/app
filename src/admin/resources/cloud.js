angular.module('App.Resources').factory('Cloud', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/cloud/:action', {}, {
      userLogList: {
        method: "GET",
        params: {
          action: 'userLog'
        },
        isArray: true
      }
    })
  }  
])