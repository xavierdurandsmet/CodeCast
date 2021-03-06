app.controller('editorCtrl', function($scope, evaluatorFactory, castFactory, $stateParams, socketFactory, $state) {
    $scope.showEnd = true;
    $scope.output;
    $scope.canEdit = false;
    $scope.editor;
    $scope.instructor;
    $scope.started = false;
    $scope.room
    $scope.user;


    $scope.codemirrorLoaded = function(_editor) {
        $scope.editor = _editor;
        if ($scope.fork === 'fork') {
            $scope.editor.setOption('readOnly', false);
        }

        //if in replay mode set readOnly to true
        else if ($scope.name === 'replay' || ($scope.user && ($scope.user._id.toString() != $scope.room.instructor._id.toString())) || !$scope.user) {
            $scope.editor.setOption('readOnly', 'nocursor');
        }
    }

    socketFactory.on('toggling editing permission to student', function(object) {
        if (($scope.editor && $scope.user._id === object.userId && !$scope.canEdit) || ($scope.user._id.toString() === $scope.room.instructor._id.toString())) {
            $scope.canEdit = true;
            $scope.editor.setOption('readOnly', false);
        } else {
            $scope.canEdit = false;
            $scope.editor.setOption('readOnly', 'nocursor');
        }
    })

    $scope.deleteRoom = function () {
    $scope.currentlyRecording = false;
    castFactory.endLecture($stateParams.roomId)
    .then(function (room) {
        // emit event socket to distribute modal to all students
        castFactory.sendModal(room._id)
      $state.go('home')
    })
  }

    $scope.$on('console', function(event, data) {
        $scope.output = '\n' + data
        castFactory.sendText($scope.replayText.text, new Date(), $stateParams.roomId, $scope.output)
    })

    $scope.getResultCode = function() {
        evaluatorFactory.evalCode($scope.replayText.text, $scope);
    }
})