angular.module('App.Files').controller('App.Files.MoveFileController', [
  '$scope',
  '$modalInstance',
  'obj',
  'Folders',
  'Files',
  function(
    $scope,
    $modalInstance,
    obj,
    Folders,
    Files
  ) {
    $scope.obj = obj

    $scope.treedata = Folders.getTree({
      type: 'tree'
    })

    // FCUK code
    var treeId = $scope.treeId = 'folderTree';
    $scope[treeId] = $scope[treeId] || {};

    //if node head clicks,
    $scope[treeId].selectNodeHead = $scope[treeId].selectNodeHead || function(selectedNode) {

      //Collapse or Expand
      selectedNode.collapsed = !selectedNode.collapsed;
    };

    //if node label clicks,
    $scope[treeId].selectNodeLabel = $scope[treeId].selectNodeLabel || function(selectedNode) {

      //remove highlight from previous node
      if ($scope[treeId].currentNode && $scope[treeId].currentNode.selected) {
        $scope[treeId].currentNode.selected = undefined;
      }

      //set highlight to selected node
      selectedNode.selected = 'selected';

      //set currentNode
      $scope[treeId].currentNode = selectedNode;
    };
    // FCUK code end

    $scope.$watch('abc.currentNode', function(newObj, oldObj) {
      if ($scope.abc && angular.isObject($scope.abc.currentNode)) {
        //          console.log('Node Selected!!');
        //          console.log($scope.folderTree.currentNode);
      }
    }, false);

    $scope.ok = function() {
      var file_id = $scope.obj.file_id
      if ($scope.obj.folder) {
        Folders.update({
          folder_id: file_id
        }, {
          parent_id: $scope.folderTree.currentNode.id
        }).$promise.then(function() {
          moved(file_id)
        })
      } else {
        Files.updateFile({
          file_id: file_id
        }, {
          parent_id: $scope.folderTree.currentNode.id
        }).$promise.then(function() {
          moved(file_id)
        })
      }
    }

    function moved(file_id) {
      $modalInstance.close(file_id)
    }

    $scope.cancel = function() {
      $modalInstance.dismiss('cancel')
    }
  }
])