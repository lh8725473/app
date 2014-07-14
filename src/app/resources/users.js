angular.module('App.Resources').factory('Users', function($resource, CONFIG) {
    return $resource(CONFIG.API_ROOT + '/user/:action/:id', {}, {
        query: {
        	method: "GET",
            params: {
                action: 'list'
            },
            isArray: true
        },
        delete: {
        	method: "DELETE",
            params: {
                action: 'delete',
                id : 0
            }
        },
        create: {
        	method: "POST",
            params: {
                action: 'create',
            }
        },
        update: {
        	method: "PUT",
            params: {
                action: 'update',
                id : 0
            }
        }
    })
})
angular.module('App.Resources').factory('Users', function($resource, CONFIG) {
    return $resource(CONFIG.API_ROOT + '/user/:action/:id', {}, {
        query: {
        	method: "GET",
            params: {
                action: 'list'
            }
        },
        delete: {
        	method: "DELETE",
            params: {
                action: 'delete',
                id : 0
            }
        },
        create: {
        	method: "POST",
            params: {
                action: 'create',
            }
        },
        update: {
        	method: "PUT",
            params: {
                action: 'update',
                id : 0
            }
        }
    })
})