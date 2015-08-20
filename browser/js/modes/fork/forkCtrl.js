app.controller('forkCtrl', function($scope, forkFactory) {
    $scope.forked = false;
    $scope.hasBeenForked = false;
    $scope.forks = [];
    $scope.showForks = false;
    $scope.forkedText = {
        text: null
    };


    $scope.makeFork = function() {
        if($scope.name !== "live") {
            $scope.pause()
        }
        $scope.hasBeenForked = true;
        $scope.forked = true;
        $scope.forkedText.text = $scope.replayObj.text;
        setTimeout(function() {
            $scope.$apply();
        }, 0);
    }

    $scope.saveFork = function() {
        var name = window.prompt("What would you like to name your fork?", "My Fork")
        forkFactory.saveUserFork(name, $scope.forkedText.text, $scope.forkedText.replayId);
    }

    $scope.hideFork = function() {
        $scope.forked = false;
    }

    $scope.getForks = function() {
        forkFactory.getUserForks($scope.forkedText.replayId)
            .then(function(forks) {
                $scope.forked = false;
                $scope.showForks = true;
                $scope.forks = forks;
            })

    }

    $scope.bringUpFork = function(forkText) {
        $scope.showForks = false;
        $scope.forked = true;
        $scope.forkedText.text = forkText
    }

})



//replayObj -> replayObj
//replayId
//pause function