angular.module('App.Resources').factory('ExternalUser', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/share/externalUser/:id', {}, {
      query: {
        method: "GET",
        isArray: true
      },
      getExternalUserById: {
        method: "GET",
        params: {
          id : ''
        },
      },
      'delete': {
        method: "DELETE",
        params: {
          id : ''
        }
      }       
    })
  }
])
