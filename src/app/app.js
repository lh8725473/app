angular.module('App', [
    // Libs
    'ui.router',

    // Components
    'App.Header',
    'App.Sidebar',
    'App.Overview',
    'App.Users',
    'App.Reports',
    'App.Settings',

    // Resources
    'App.Resources'

]).config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
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
            .state('users.managedUers', {
                url: '/managedUers',
                templateUrl: 'src/app/users/managedUers/template.html'
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
    }
])