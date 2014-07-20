angular.module('App.Resources').factory('Group', function($resource, CONFIG) {
    return $resource(CONFIG.API_ROOT + '/group/:action/:id', {}, {
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