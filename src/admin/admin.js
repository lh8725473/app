angular.module('App', [
  // Libs
  'ui.router',
  'ngGrid',
  'ui.bootstrap',
  'ngAnimate',
  'ngCookies',
  'pascalprecht.translate',
  'highcharts-ng',
  'perfect_scrollbar',

  // Config
  'App.Config',

  // Widget
  'App.Widgets',
  
  // global components
  'ACT.LoadingIndictor',

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
  '$cookieStore',
  '$rootScope',
  'CONFIG',
  function(
    $q,
    $cookieStore,
    $rootScope,
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
          $cookieStore.removeCookie('accessToken')
          window.location.href = CONFIG.LOGIN_PATH
        } 
//      else if (rejection.status == 501) {
//        $rootScope.noRight = true
//        $rootScope.noRightMsg = rejection.data.result
//      }
        return $q.reject(rejection)
      }
    }
  }
]).config(['$provide', function($provide) {
  $provide.decorator('$cookieStore', ['$delegate', function($delegate) {
    function createCookie(name, value, days) {
      if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = '; expires=' + date.toGMTString();
      } else {
        var expires = '';
      }
      document.cookie = name + '=' + value + expires + '; path=/';
    }

    function readCookie(name) {
      var nameEQ = name + '=';
      var ca = document.cookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
          return c.substring(nameEQ.length, c.length);
        }
      }
      return null;
    }

    function removeCookie(name) {
      createCookie(name, '', -1);
    }

    $delegate.createCookie = createCookie
    $delegate.readCookie = readCookie
    $delegate.removeCookie = removeCookie

    return $delegate
  }])
}]).config([
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
        templateUrl: 'src/admin/overview/template.html'
      })
      .state('users', {
        url: '/users',
        templateUrl: 'src/admin/users/template.html'
      })
      .state('users.managedUsers', {
        url: '/managedUsers?k',
        templateUrl: 'src/admin/users/managedUsers/template.html'
      })
      .state('users.editUser', {
        url: '/editUser/:id',
        templateUrl: 'src/admin/users/managedUsers/editUser/update-user-modal.html'
      })
      .state('users.externalUsers', {
        url: '/externalUsers',
        templateUrl: 'src/admin/users/externalUsers/template.html'
      })
      .state('users.editExternalUser', {
        url: '/editExternalUser/:id',
        templateUrl: 'src/admin/users/externalUsers/editExternalUser/update-externalUser-modal.html'
      })
      .state('users.groups', {
        url: '/groups',
        templateUrl: 'src/admin/users/groups/template.html'
      })
      .state('users.editGroup', {
        url: '/editGroup/:id',
        templateUrl: 'src/admin/users/groups/editGroup/update-group-modal.html'
      })
      .state('reports', {
        url: '/reports',
        templateUrl: 'src/admin/reports/template.html'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'src/admin/settings/template.html'
      })

    $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
    $httpProvider.interceptors.push('httpInterceptor')

    $translatePartialLoaderProvider.addPart('admin')
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
