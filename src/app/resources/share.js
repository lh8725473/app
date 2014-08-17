angular.module('App.Resources').factory('Share', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/:action', {}, {
      query: {
        method: "GET",
        params: {
          action: 'folderList'
        },
        isArray: true
      }
    })
  }  
])