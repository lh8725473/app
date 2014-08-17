angular.module('App.Config', []).constant('CONFIG', {
  
  // develop
  API_ROOT: 'http://101.231.216.75:8888/api',

  // production
  // API_ROOT: '/api',

  // localhost
  // API_ROOT: 'http://localhost/api',

  LOGIN_PATH: '../index.html',
  
  //permission
  PERMISSION_KEY: ['1111111', '0111111', '0001111', '0000101', '0001110', '0111111', '0000100', '0000001'],
  PERMISSION_VALUE: ['拥有者', '编辑者', '查看上传者', '预览上传者', '查看者', '编辑者', '预览者', '上传者']
})
