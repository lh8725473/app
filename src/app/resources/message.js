angular.module('App.Resources').factory('Message', [
  '$resource',
  'CONFIG',
  function(
    $resource,
    CONFIG
  ) {
    return $resource(CONFIG.API_ROOT + '/message/:action/:id', {}, {
      getUnreadMessagesCount: {
        method: "GET",
        params: {
          action: 'unreadCount'
        }
      }
    })
  }  
])