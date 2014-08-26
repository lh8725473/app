angular.module('App.Resources').factory('Folders', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/folder/obj/:action', {}, {
      getObjList: {
        method: "GET",
        params: {
          action: 'list',
          folder_id: 0
        },
        isArray: true
      }
    })
  }  
])