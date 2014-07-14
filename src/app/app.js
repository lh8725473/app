angular.module('App', [
    // Libs
    'ui.router',
    'ngGrid', 
    'ui.bootstrap',

    // Config
    'App.Config',

    // Components
    'App.Header',
    'App.Sidebar',
    'App.Overview',
    'App.Users',
    'App.Reports',
    'App.Settings',

    // Resources
    'App.Resources'

    // Http Interceptor
]).factory('httpInterceptor',
    function($q) {
        return {
            response: function(response) {
                if (response.data.result) {
                    response.data = response.data.result
                }
                return response
            },
            responseError: function(rejection) {
                // Handle Request error
//              if (response.status === 401) {
//                  return $q.reject(response)
//              } else {
//                  return $q.reject(response)
//              }
            }
        }
    }
).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', 'CONFIG',
    function($stateProvider, $urlRouterProvider, $httpProvider, CONFIG) {
        $urlRouterProvider.otherwise('/overview')
        $stateProvider
            .state('overview', {
                url: '/overview',
                templateUrl: 'src/app/overview/template.html'
            })

        .state('users', {
            url: '/users',
            templateUrl: 'src/app/users/template.html'
        })
            .state('users.managedUsers', {
                url: '/managedUsers',
                templateUrl: 'src/app/users/managedUsers/template.html'
            })
            .state('users.externalUers', {
                url: '/externalUers',
                templateUrl: 'src/app/users/externalUsers/template.html'
            })
            .state('users.groups', {
                url: '/groups',
                templateUrl: 'src/app/users/groups/template.html'
            })

        .state('reports', {
            url: '/users',
            templateUrl: 'src/app/reports/template.html'
        })

        .state('settings', {
            url: '/users',
            templateUrl: 'src/app/settings/template.html'
        })

        $httpProvider.defaults.headers.common['HTTP_X_OAUTH'] = CONFIG.token
        $httpProvider.interceptors.push('httpInterceptor')
    }
])
