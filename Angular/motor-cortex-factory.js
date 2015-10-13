app.factory('MotorCortext', function($q, $interval, $timeout) {
    var MotorCortex = window.MotorCortex || null;

    var waitForDfd = $q.defer(),
        mssCache = {},
        svc = {},
        checkingPromise,
        mc;

    function checkForMotorCortext() {
        if (MotorCortex) {
            mc = new MotorCortex({debug:true});
            $interval.cancel(checkingPromise);
            waitForDfd.resolve();
        }
    }

    function ctor() {
        checkingPromise = $interval(checkForMotorCortext, 100);
    }


    function waitFor() {
        return waitForDfd.promise;
    }


    svc.ensureMss = function(filePath) {
        return waitFor().then(function _waitForMssComplete() {
            var loadMssDfd = $q.defer();

            if (mssCache[filePath]) {
                return $q.when(true);
            }
            mc.loadMSS(filePath, function _loadMssCallback() { //'./mc.mss'
                mssCache[filePath] = true;
                loadMssDfd.resolve(true);
            });
            return loadMssDfd.promise;

        });
    };

    svc.trigger = function(eventName, event, props, callback) {

        if(!event){
            $timeout(function() {
                mc.trigger(eventName);
            }, 0);
        } else if(!props){
            $timeout(function() {
                mc.trigger(eventName, event);
            }, 0);
        } else if(!callback){
            $timeout(function() {
                mc.trigger(eventName, callback, props);
            }, 0);
        } else {
            $timeout(function() {
                mc.trigger(eventName, callback, props, callback);
            }, 0);
        }


    };

    ctor();
    return svc;
});