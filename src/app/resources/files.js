angular.module('App.Resources').factory('Files', [
  '$resource',
  '$http',
  '$sce',
  '$q',
  'CONFIG',
  function(
    $resource,
    $http,
    $sce,
    $q,
    CONFIG
  ) {
    var Files = $resource(CONFIG.API_ROOT + '/file/:action/:file_id', {}, {
      view:{
        method: "GET",
        params: {
          action: 'view',
          file_id: ''
        }
      },
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
        }
      },
      history:{
        method: "GET",
        params: {
          action: 'history',
          file_id: ''
        },
        isArray: true
      }
    })
    angular.extend(Files, {
      preview: function(file_id, refresh) {
        var deferred = $q.defer()
        var param = (refresh == true)?'?refresh=true':''
        $http({
          url: CONFIG.API_ROOT + '/file/preview/' + file_id + param,
          method: 'GET'
        }).then(function(response) {
          deferred.resolve($sce.trustAsHtml(response.data))
        }, function(err) {
          deferred.reject(err);
        })
        return deferred.promise;
      }
    })
    
    return Files
  }  
])
