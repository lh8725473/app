angular.module('App.Resources').factory('Share', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/folder/:action/:id', {}, {
      queryShareObj: {
        method: "GET",
        params: {
          action: 'userList',
          id : 0
        },
        isArray: false
      }
    })
  }  
])