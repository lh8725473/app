angular.module('App.Resources').factory('Files', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/file/:action/:file_id', {}, {
      deleteFile: {
        method: "DELETE",
        params: {
          action: 'delete',
          file_id: ''
        }
      },
      updateFile:{
      	method: "PUT",
        params: {
          action: 'update',
          file_id: ''
        }
      },
      preview:{
      	method: "GET",
        params: {
          action: 'preview',
          file_id: ''
        },
        responseType : 'text/plain'
      }
    })
  }  
])