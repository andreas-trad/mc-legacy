var app = angular.module('plunker', []);

app.controller('MainCtrl', function($scope, $interval, MotorCortext) {
  MotorCortext
    .ensureMss('./mc.mss') // waits for the library and mss file to load
    .then(function() {
      loadData();
      
      //fake getting some data.
      $interval(loadData, 5000);
    });

  //fake getting some data. perhaps websocket or http call
  function loadData() {
    $scope.bars = _.times(10, function() {
      return _.random(10, 100)
    });

    MotorCortext
      .trigger('showBars');
  }
});

app.factory('MotorCortext', function($q, $interval, $timeout) {
  var waitForDfd = $q.defer(),
    mssCache = {},
    svc = {},
    checkingPromise,
    mc;

  svc.ensureMss = function(filePath) {
    return waitFor().then(function _waitForMssComplete() {
      var loadMssDfd = $q.defer();

      if (mssCache[filePath]) {
        return $q.when(true);
      } else {
        mc.loadMSS(filePath, function _loadMssCallback() { //'./mc.mss'
          mssCache[filePath] = true;
          loadMssDfd.resolve(true);
        });
        return loadMssDfd.promise;
      }
    });
  };

  svc.trigger = function(eventName) {
    var triggerDfd = $q.defer();
    $timeout(function() {
      mc.trigger(eventName, function _triggerCallback() { //"showBars"
        triggerDfd.resolve();
      });
    }, 0);

    return triggerDfd.promise;
  };

  ctor();
  return svc;

  function ctor() {
    checkingPromise = $interval(checkForMotorCortext, 100);
  }

  function checkForMotorCortext() {
    if (MotorCortex) {
      mc = new MotorCortex();
      $interval.cancel(checkingPromise);
      waitForDfd.resolve();
    }
  }

  function waitFor() {
    return waitForDfd.promise;
  }
});


// for odometer number widget
app.config(function() {
  return window.odometerOptions = {
    auto: false
  };
});

app.directive('odometer', function() {
  return {
    restrict: 'E',
    require: 'ngModel',
    scope: {
      model: '=ngModel'
    },
    link: function($scope, el, attr) {
      var o;
      o = new Odometer({
        el: el[0],
        value: $scope.model,
        format: '',
        duration: 300
      });
      return $scope.$watch("model", function(newVal) {
        return o.update(newVal);
      });
    }
  };
});