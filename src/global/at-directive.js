angular.module('Act.at', []).directive('at', [
  function() {
    return {
      restrict: 'A',
      link: function(scope, element, attrs) {
        element.atwho(scope[attrs.at])
      }
    }
  }
])