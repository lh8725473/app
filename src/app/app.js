angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
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
]).factory('httpInterceptor',[
  '$q',
  'CONFIG',
  function(
    $q,
    CONFIG
  ) {
    return {
      response: function(response) {
        if (response.data.result) {
          response.data = response.data.result
        }
        return response
      },
      responseError: function(rejection) {
        // Handle Request error
        window.location.href = CONFIG.LOGIN_PATH
        return $q.reject(rejection)
      }
    }
  }
]).config([
  '$stateProvider',
  '$urlRouterProvider',
  '$httpProvider',
  '$translateProvider',
  '$translatePartialLoaderProvider',
  'CONFIG',
  function (
    $stateProvider,
    $urlRouterProvider,
    $httpProvider,
    $translateProvider,
    $translatePartialLoaderProvider,
    CONFIG
  ) {
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
      .state('users.editUser', {
        url: '/editUser/:id',
        templateUrl: 'src/app/users/managedUsers/editUser/update-user-modal.html'
      })
      .state('users.externalUsers', {
        url: '/externalUsers',
        templateUrl: 'src/app/users/externalUsers/template.html'
      })
      .state('users.editExternalUser', {
        url: '/editExternalUser/:id',
        templateUrl: 'src/app/users/externalUsers/editExternalUser/update-externalUser-modal.html'
      })
      .state('users.groups', {
        url: '/groups',
        templateUrl: 'src/app/users/groups/template.html'
      })
      .state('users.editGroup', {
        url: '/editGroup/:id',
        templateUrl: 'src/app/users/groups/editGroup/update-group-modal.html'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'src/app/reports/template.html'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'src/app/settings/template.html'
      })

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')

    // $translatePartialLoaderProvider.addPart('app')
    $translateProvider.useLoader('$translatePartialLoader', {
      urlTemplate: 'src/{part}/locals/{lang}.json'
    });
    $translateProvider.preferredLanguage('zh-CN');
  }
]).run([
  '$http',
  '$cookies',
  '$rootScope',
  '$translate',
  function(
    $http,
    $cookies,
    $rootScope,
    $translate
  ) {
    $http.defaults.headers.common['HTTP_X_OAUTH'] = $cookies.accessToken
    $rootScope.$on('$translatePartialLoaderStructureChanged', function() {
      $translate.refresh();
    });
  }
])
