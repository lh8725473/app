angular.module('App.Files').controller('App.Files.LinkShareController', [
  '$scope',
  '$modalInstance',
  'obj',
  'users',
  'Share',
  function(  
    $scope,
    $modalInstance,
    obj,
    users,
    Share
  ) {
        $scope.emailSelectOptions = {
          'multiple': true,
          'simple_tags': true,
          'tags': users.map(function(user) {
            return user.email
          })
        }

        $scope.selectedEmails = []

        $scope.today = function() {
          $scope.dt = new Date()
        };
        $scope.today()

        $scope.clear = function() {
          $scope.dt = null
        }

        // Disable weekend selection
        $scope.disabled = function(date, mode) {
          return (mode === 'day' && (date.getDay() === 0 || date.getDay() === 6))
        }

        $scope.toggleMin = function() {
          $scope.minDate = $scope.minDate ? null : new Date()
        };
        $scope.toggleMin()

        $scope.open = function($event) {
          $event.preventDefault()
          $event.stopPropagation()
          $scope.opened = true
        };

        $scope.dateOptions = {
          formatYear: 'yy',
          startingDay: 1
        };

        $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate']
        $scope.format = $scope.formats[1]

        //链接对象
        $scope.obj = obj

        //链接对象类型
        if ($scope.obj.folder) {
          $scope.type = "folder"
        } else {
          $scope.type = "file"
        }

        //链接分享权限
        $scope.linkSharePermissionValue = "仅预览"
        $scope.linkSharePermissionKey = "0000100"

        //链接分享权限List
        $scope.linkSharePermissionValueList = ["仅预览", "仅上传", "可预览和下载", "可预览、下载和上传"]
        $scope.linkSharePermissionKeyList = ["0000100", "0000001", "0001110", "0001111"]

        //是否设置访问权限
        $scope.linkSharePasswordShow = false

        //访问密码
        $scope.linkSharePassword = ""

        //是否设置访问权限切换
        $scope.changeLinkSharePasswordShow = function() {
          if (!$scope.linkSharePasswordShow) {
            $scope.linkSharePassword = ""
          }
        }

        $scope.sendEmail = function() {
          Share.sendEmail({},{
            obj_name : obj.file_name,
            link : $scope.link,
            emails : $scope.selectedEmails
          }).$promise.then(function() {
            alert("发送邮件成功")
            $modalInstance.dismiss('cancel')
          })
        }

        //链接分享访问密码输入框type
        $scope.linkSharePasswordType = 'password'

        //显示或者隐藏密码
        $scope.changeLinkSharePasswordType = function() {
          if ($scope.linkSharePasswordType == 'password') {
            $scope.linkSharePasswordType = 'text'
          } else {
            $scope.linkSharePasswordType = 'password'
          }
        }

        //选择链接dropdown是否显示
        $scope.permissionOpen = false

        //链接分享选择权限
        $scope.changeLinkSharePermission = function(value) {
          $scope.permissionOpen = !$scope.permissionOpen
          $scope.linkSharePermissionValue = value
          angular.forEach($scope.linkSharePermissionValueList, function(permissionvalue, index) {
            if (permissionvalue == value) {
              $scope.linkSharePermissionKey = $scope.linkSharePermissionKeyList[index]
            }
          })
        }

        //链接说明
        $scope.comment = ""

        //生成链接
        $scope.createLinkShare = function() {
          $scope.linkCreateOrSend = !$scope.linkCreateOrSend
          Share.getLink({}, {
            comment: $scope.comment,
            expiration: $scope.dt,
            obj_id: $scope.obj.file_id,
            obj_name: $scope.obj.file_name,
            obj_type: $scope.type,
            password: $scope.linkSharePassword,
            permission: $scope.linkSharePermissionKey
          }).$promise.then(function(linkShare) {
            $scope.link = linkShare.link
            $scope.code_src = linkShare.code_src
          }, function (error) {
                Notification.show({
                    title: '失败',
                    type: 'danger',
                    msg: error.data.result,
                    closeable: false
                })
            }
          )
        }

        //生成链接与发送链接邀请form切换
        $scope.linkCreateOrSend = true;

        //返回修改
        $scope.backToCreate = function() {
          $scope.linkCreateOrSend = !$scope.linkCreateOrSend
        }

        //复制链接地址至剪切板
        $scope.getTextLinkUrl = function() {
          alert("链接已复制到剪切板")
          return $scope.link
        }

        $scope.cancel = function() {
          $modalInstance.dismiss('cancel')
        }
  }
])