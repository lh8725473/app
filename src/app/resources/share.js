angular.module('App.Resources').factory('Share', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/:action/:id?type=folder', {}, {
      queryShareObj: {
        method: "GET",
        params: {
          action: 'obj',
          id : 0
        },
        isArray: false
      }
    })
  }  
])