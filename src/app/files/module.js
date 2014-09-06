angular.module('App.Files', ["ngClipboard"]).config(['ngClipProvider', function(ngClipProvider) {
    ngClipProvider.setPath("../admin/bower_components/zeroclipboard/dist/ZeroClipboard.swf");
  }]);