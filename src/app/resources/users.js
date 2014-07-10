angular.module('App.Resources').factory('Users', function($resource) {
    return $resource('/users/:userId', {
        userId: '@id'
    })
})