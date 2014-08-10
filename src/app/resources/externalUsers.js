angular.module('App.Resources').factory('ExternalUser', function($resource, CONFIG) {
    return $resource(CONFIG.API_ROOT + '/share/externalUser/:id', {}, {
        query: {
        	method: "GET",
            isArray: true
        },
        getUserById: {
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
})