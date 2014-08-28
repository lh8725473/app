angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'mb-scrollbar',
  'pascalprecht.translate',
  'ng-context-menu',
  'angularFileUpload',
  'ngSanitize',
  'angularTreeview',
  'snap',
  "pageslide-directive",

  // Config
  'App.Config',

  // Resources
  'App.Resources',

  // Widget
  'App.Widgets',	
	
  // Components
  'App.Header',
  'App.Sidebar',
  'App.Updates',
  'App.Files',
  'App.Contacts',
  'App.Trash',
  'App.UploadProgressDialog'


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
        if(rejection.status == 401){//401 accessToken 无效
          window.location.href = CONFIG.LOGIN_PATH
        }
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
    $urlRouterProvider.otherwise('/updates')
    $stateProvider
      .state('updates', {
        url: '/updates',
        templateUrl: 'src/app/updates/template.html'
      })
      .state('files', {
        url: '/files/:folderId',
        templateUrl: 'src/app/files/template.html'
      })
      .state('contacts', {
        url: '/contacts',
        templateUrl: 'src/app/contacts/template.html'
      })
      .state('trash', {
        url: '/trash',
        templateUrl: 'src/app/trash/template.html'
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
