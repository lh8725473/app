angular.module('App.Resources').factory('Users', function($resource, CONFIG) {
    return $resource(CONFIG.API_ROOT + '/user/:action', {}, {
        query: {
            params: {
                action: 'list'
            },
            isArray: true
        }
    })
})