angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'mb-scrollbar',
  'pascalprecht.translate',

  // Config
  'App.Config',

  // Widget
  'App.Widgets',

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
        console.log(JSON.stringify(rejection))
        return $q.reject(rejection)
      }
    }
  }
).config(['$stateProvider', '$urlRouterProvider', '$httpProvider', '$translateProvider', '$translatePartialLoaderProvider', 'CONFIG',
  function($stateProvider, $urlRouterProvider, $httpProvider, $translateProvider, $translatePartialLoaderProvider, CONFIG) {
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
      url: '/reports',
      templateUrl: 'src/app/reports/template.html'
    })

    .state('settings', {
      url: '/settings',
      templateUrl: 'src/app/settings/template.html'
    })

    $httpProvider.defaults.headers.common['HTTP_X_OAUTH'] = CONFIG.token
    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')

    $translatePartialLoaderProvider.addPart('app')
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'src/{part}/locals/{lang}.json'
    });
    $translateProvider.preferredLanguage('zh-CN');
  }
]).run(function($rootScope, $translate) {
  $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
    $translate.refresh();
  });
})