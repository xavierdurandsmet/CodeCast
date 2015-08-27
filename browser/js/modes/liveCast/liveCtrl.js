app.controller('liveCtrl', function($scope, $interval, castFactory, $q, $document, $rootScope, socketFactory, $stateParams, evaluatorFactory, $state, roomInfo, setUser) {
  $scope.user = setUser;
  $scope.room = roomInfo;
  $scope.currentlyRecording = false;

  // socketFactory.emit('join', {room: $stateParams.roomId, user: $scope.user})
  $scope.replayObj = {
    text: roomInfo.textHistory,
    result: roomInfo.resultHistory,
    comments: roomInfo.commentHistory
  };

  //listener for when roomInfo changes on joining a room
  //everytime the instructor types, change the textsnip and the result if there is
  socketFactory.on('change the textSnip', function(codeSliceObj) {
    $scope.replayObj.text = codeSliceObj.text;
    $scope.replayObj.result = codeSliceObj.result;
  })

  socketFactory.on('add to room.students', function(newRoom) {
    $scope.room = newRoom;
    console.log('room.students after joined by user', $scope.room.students)
  })

  socketFactory.on('delete from room.students', function(newRoom) {
    $scope.room = newRoom;
  })

    console.log('user in attendeeListCtrl', $scope.user)
  console.log('room.students in attendeeListCtrl', $scope.room.students)

  var keystroke = false;
  var timerPromise;
  $scope.evals = evaluatorFactory.liveEvals;

  $scope.startLecture = function() {
    if (!$scope.currentlyRecording) {
      castFactory.startLecture($stateParams.roomId)
      $scope.currentlyRecording = true;
    }
  }

  $scope.constantRecording = function() {
    if ($scope.currentlyRecording) {
      castFactory.sendText($scope.replayObj.text, new Date(), $stateParams.roomId, $scope.replayObj.result);
    }
  }
});