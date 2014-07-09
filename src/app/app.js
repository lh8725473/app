angular.module('App', [
  // Libs
  'ui.router',

  // Components
  'App.Header',
  'App.Sidebar',
  'App.Overview',
  'App.Users',
  'App.Reports',
  'App.Settings'
  
]).config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/overview')
  $stateProvider
    .state('overview', {
      url:'/overview',
      templateUrl: 'src/app/overview/template.html'
    })
    .state('users', {
      url: '/users',
      templateUrl: 'src/app/users/template.html'
    })
    .state('reports', {
      url: '/users',
      templateUrl: 'src/app/reports/template.html'
    })
    .state('settings', {
      url: '/users',
      templateUrl: 'src/app/settings/template.html'
    })
}])