angular.module('App', [
    // Libs
    'ui.router',

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

]).config(['$stateProvider', '$urlRouterProvider', '$httpProvider',
    function($stateProvider, $urlRouterProvider, $httpProvider) {
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
                templateUrl: 'src/app/users/externalUers/template.html'
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

        $httpProvider.defaults.headers.common['HTTP_X_OAUTH'] = 'f9ddda3d733345001511a8825e6c9f4f'
    }
])