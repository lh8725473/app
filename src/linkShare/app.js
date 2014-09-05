angular.module('App', [
  // Libs
  'ui.router',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'pascalprecht.translate',
  'angular-md5',
  'angularFileUpload',

  // Config
  'App.Config',

  // Resources
  'App.Resources',

  // Widget
  'App.Widgets',	
	
  // Components
  'App.Header',
  'App.Sidebar',
  'App.UploadProgressDialog',
  'App.LinkShare'


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
    $urlRouterProvider.otherwise('/')
    $stateProvider
      .state('shares', {
        url: '/:key/:folderId',
        templateUrl: 'src/linkShare/main/template.html'
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
