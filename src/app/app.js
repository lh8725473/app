angular.module('App', [
  // Libs
  'ngRoute',

  // Components
  'App.Header',
  'App.Sidebar',
  'App.Overview',
  'App.Users',
  'App.Reports',
  'App.Settings'
  
]).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider.when('/', {
    templateUrl: 'src/app/overview/template.html'
  }).when('/overview', {
    templateUrl: 'src/app/overview/template.html'
  }).when('/users', {
    templateUrl: 'src/app/users/template.html'
  }).when('/reports', {
    templateUrl: 'src/app/reports/template.html'
  }).when('/settings', {
    templateUrl: 'src/app/settings/template.html'
  });

  // $locationProvider.html5Mode(true);
}])