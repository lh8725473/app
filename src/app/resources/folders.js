angular.module('App.Resources').factory('Folders', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/folder/:action/:folder_id', {}, {
      getObjList: {
        method: "GET",
        params: {
          action: 'objList',
          folder_id: 0
        },
        isArray: true
      },
      queryShareObj: {
        method: "GET",
        params: {
          action: 'userList',
          folder_id : 0
        },
        isArray: false
      },
      getTree: {
        method: "GET",
        params: {
          action: 'getTree'
        },
        isArray: true
      },
      update: {
        method: "PUT",
        params: {
          action: 'update',
          folder_id: 0
        }
      }
    })
  }  
])