/*global jQuery */
/*!
 * MotorCortex.js 0.1.0
 *
 * Copyright 2014, Andreas Trantidis
 * atrantidis@gmail.com
 * Released under the WTFPL license
 * http://sam.zoy.org/wtfpl/
 *
 */

(function(window){
    window.MotorCortex = function(options){
        var mc_debug = false;
        if(options){
            mc_debug = options.hasOwnProperty('debug')?options.debug:false;
        }
        var globals = [];
        var events = [];
        var eventsCallbacks = [];

        var MC = this;

        var optionsNames = ["duration", "easing", "delay", "complete", "loop"];
        //var

        var genRandom = function(x, y){
            var min = x*1;
            var max = y*1;

            if(y <= x){
                MC.log("warn", "When using @rand make sure the first parameter is always smaller than the first one. Reverting and proceeding");
                var max = x*1;
                var min = y*1;
            }

            var dif = max - min;
            return min + dif*Math.random();
        };

        var getEventObjectByName = function(eventName){
            return events[eventName];
        };

        var getPrefix = function(string){
            if(string.indexOf('+=') == 0){
                return "+=";
            } else if(string.indexOf('-=') == 0){
                return '-=';
            } else if(string.indexOf('-') == 0){
                return '-';
            } else {
                return "";
            }
        };

        var getUnits = function(string){
            if(string.indexOf(')px', string.length - 3) !== -1){
                return 'px';
            } else if(string.indexOf('%', string.length - 1) !== -1){
                return '%';
            } else {
                return '';
            }
        };

        var getProperty = function(string){
            var alpha = string.split('.')[1].split(')')[0];
            if(alpha.indexOf('%') != -1){
                return alpha.substring(0, alpha.length - 1);
            } else {
                return alpha;
            }
        };

        this.trigger = function(eventName, e, options, callback){
            var paramsOK = true;
            var execProcess;

            var u_event, u_options, u_callback;

            if(arguments.length === 0){
                MC.log("error", "You must always include the event name to be triggered when invoking the MotorCortex.trigger function, as the first parameter in string format");
                execProcess = new ExecutionProcess(null);
                paramsOK = false;
            } else {
                if(typeof arguments[0] != "string"){
                    MC.log("error", "The first argument of the trigger function should always be a string representing the name of the event to be triggered. "
                        + typeof arguments[0] + " passed on call.");
                    execProcess = new ExecutionProcess(null);
                    paramsOK = false;
                } else if(arguments.length > 1) {
                    if(typeof arguments[1] === "object" && arguments[1] != null){
                        if(arguments[1].target){
                            u_event = arguments[1];
                            if(arguments.length > 2){
                                if(typeof arguments[2] === "object" && arguments[2] != null){
                                    u_options = arguments[2];
                                    if(arguments.length > 3){
                                        if(typeof arguments[3] === "function"){
                                            u_callback = arguments[3];
                                        } else {
                                            MC.log("error", "Unrecognized type of 4th parameter on trigger function of event " + eventName + ". Function expected, " + typeof arguments[3] + " passed.");
                                            paramsOK = false;
                                        }
                                    }
                                } else if(typeof arguments[2] === "function"){
                                    u_callback = arguments[2];
                                } else { // 3rd argument was neither an object nor a function
                                    MC.log("error", "Unrecognized type of 3rd parameter on trigger function of event " + eventName + ". Object or Function expected, " + typeof arguments[2] + " passed.");
                                    paramsOK = false;
                                }
                            }
                        } else { // 2nd argument is object but not the event one
                            u_options = arguments[1];
                            if(arguments.length > 2){
                                if(typeof arguments[2] != "function"){ // the 2nd parameter was not the event object, it was an object though so it has been considered as the options one. Thought the following parameter it wasn't a function as expected
                                    MC.log("error", "Unrecognized type of 3rd parameter on trigger function of event " + eventName + ". Function expected, " + typeof arguments[2] + " passed.");
                                    paramsOK = false;
                                } else {
                                    u_callback = arguments[2];
                                }
                            }
                        }
                    } else if(typeof arguments[1] === "function"){
                        u_callback = arguments[1];
                    } else {
                        MC.log("error", "Unrecognized type of 2nd parameter on trigger function of event " + eventName + ". Object or Function expected, " + typeof arguments[1] + " passed.");
                        paramsOK = false;
                    }
                }
            }

            if(!u_options){
                u_options = {};
            }
            if(!u_callback){
                u_callback = function(){};
            }

            if(paramsOK){
                if(events.hasOwnProperty(eventName)){
                    //console.log('event found');
                    execProcess = new ExecutionProcess(events[eventName]);
                    events[eventName].fire(u_event, u_options, u_callback);
                } else {
                    execProcess = new ExecutionProcess(null);
                    MC.log("error", "The event with name " + eventName + " has not been defined in any of the MSS files. It will be ignored!");
                }
            }

            return execProcess;
        }

        var compile = function(topNode, callback){
            var callbackRegex = new RegExp(/^[a-zA-Z0-9\.\-\_]+\:callback$/);
            var globalsRegx = new RegExp(/^@[a-zA-Z0-9\.\-\_]*?/);

            for(var property in topNode.attributes){
                if(topNode.attributes.hasOwnProperty(property)){
                    // step 0. Check if global
                    if(property == "@index" || property == "@params" || property == "@domel"){
                        MC.log("warn", "The keywords/parameter names @index, @params and @domel are reserved by MotorCortex " +
                            "and cannot be used as a global variable's name. The declared global " + property + " will be ignored!");
                    } else if(globalsRegx.exec(property)){
                        globals[property] = topNode.attributes[property];
                    } else {
                        MC.log("warn", "The property " + property + " should begin with the character '@'. It will be ignored!");
                    }
                }
            }

            for(var property in topNode.children){
                if(callbackRegex.exec(property)){
                    var selectorArray = property.split(":");
                    eventsCallbacks[selectorArray[0]] = topNode.children[property].attributes.eventName;
                }

                // 1.a Split the expression
                var selectorArray = property.split(":");

                // 1.b Check that the newly created array is at least of length 2
                if(selectorArray.length < 2){
                    MC.log("error", "The MC selection and event part " + property + " is not valid. Each MC selection string should consist by least a selection string and an event name" +
                        " separated by the ':' character.");
                } else {
                    if(!events.hasOwnProperty(selectorArray[selectorArray.length - 1])){
                        var eventLoops = 1;
                        if(topNode.children[property].attributes.hasOwnProperty('loop')){
                            eventLoops = topNode.children[property].attributes['loop'];
                        }
                        var event = new Event(eventLoops, selectorArray[selectorArray.length - 1]);
                        event.addThread(selectorArray, topNode.children[property]);
                        events[selectorArray[selectorArray.length - 1]] = event;
                    } else {
                        event.addThread(selectorArray, topNode.children[property]);
                    }
                }
            }

            callback();
        };


        var ExecutionProcess = function(event){
            this.stop = function(){
                if(event){
                    event.stop();
                } else {
                    MC.log("error", "You tried to stop a process that has not been executed.");
                }
            }
        };

        /*
         Creates the Thread object
         It returns an array containing any extra Threads that might come up during the node analysis.
         New Threads come up if in the body of the actual Thread's node should be separated in more than one
         */
        var Thread = function(selector, node, EventObject, parentProperties, findString){
            this.loops = 1;

            if(!parentProperties){
                parentProperties = {
                    attributes:{},
                    options:{}
                };
            }
            if(!findString){
                findString = '';
            }

            this.selectionFunction = this.createSelectionFunction(selector, findString);

            var globalsRegex = new RegExp(/^@globals\.[a-zA-Z0-9\-\_]*$/);

            var ownAttrs = JSON.parse(JSON.stringify(parentProperties));
            ownAttrs.attributes = {};

            for(var property in node.attributes){
                if(globalsRegex.exec(node.attributes[property])){
                    var expectedGlobalsKey = node.attributes[property].split('.')[1].trim();
                    if(!globals.hasOwnProperty("@"+expectedGlobalsKey)){
                        MC.log("error", "The global variable " + node.attributes[property] + " is not defined. It will be ignored");
                    } else {
                        node.attributes[property] = globals['@' + expectedGlobalsKey];
                    }
                }

                if(optionsNames.indexOf(property) >= 0){
                    if(property !== "loop"){
                        ownAttrs.options[property] = node.attributes[property];
                    } else {
                        this.loops = node.attributes[property];
                    }
                } else {
                    ownAttrs.attributes[property] = node.attributes[property];
                }
            }

            var callbackFunction = function(){
                EventObject.CallbackHandler.animationEnded();
            }

            var childs = Object.keys(node.children);

            if(node.attributes.hasOwnProperty('loop')){
                EventObject.setLoopTimes(node.attributes.loop);
            }

            for(var i=0; i<childs.length; i++){
                var childName = childs[i];

                if(childName == "complete:trigger"){
                    callbackFunction = function(e, params){
                        var callback = function(){
                            EventObject.CallbackHandler.animationEnded();
                        }
                        getEventObjectByName(node.children[childName].attributes.eventName).fire(e, params, callback);
                    }
                } else if(childName != "complete"){
                    EventObject.addReadyThread(new Thread(this.selectionFunction, node.children[childName], EventObject, ownAttrs, childName));
                } else {
                    var eventLoops = 1;
                    if(node.children[childName].attributes.hasOwnProperty('loop')){
                        eventLoops = node.children[childName].attributes['loop'];
                    }

                    var nestedEvent = new Event(eventLoops);
                    nestedEvent.addReadyThread(new Thread(this.selectionFunction, node.children.complete, nestedEvent, ownAttrs));
                    callbackFunction = function(e, params){
                        var callback = function(){
                            EventObject.CallbackHandler.animationEnded();
                        }
                        nestedEvent.fire(e, params, callback);
                    }
                }
            }

            this.createAnimationFunction(ownAttrs, callbackFunction);


            this.execute = function(e, params){
                this.animationFunction(e, params, callbackFunction);
            };

        };


        /*
         Creates the animationFunction of the Thread.
         The animationFunction (during runtime) picks all the elements that should be animated invoking the already
         baked "selectionFunction" of the Thread and executes animations according to the parameters.
         */
        Thread.prototype.createAnimationFunction = function(properties){
            var paramsRegex = new RegExp(/^@params\.[a-zA-Z0-9\-\_]*$|^-@params\.[a-zA-Z0-9\-\_]*$|^-=@params\.[a-zA-Z0-9\-\_]*$|^\+=@params\.[a-zA-Z0-9\-\_]*$|^@params\.[a-zA-Z0-9\-\_]*.%$|-^@params\.[a-zA-Z0-9\-\_]*.%$|^-=@params\.[a-zA-Z0-9\-\_]*.%$|^\+=@params\.[a-zA-Z0-9\-\_]*.%$|^\(@params\.[a-zA-Z0-9\-\_]*.\)px$|-^\(@params\.[a-zA-Z0-9\-\_]*.\)px$|^-=\(@params\.[a-zA-Z0-9\-\_]*.\)px$|^\+=\(@params\.[a-zA-Z0-9\-\_]*.\)px$/);
            var domelRegex = new RegExp(/^@domel\.[a-zA-Z0-9\-\_]*$|^-@domel\.[a-zA-Z0-9\-\_]*$|^-=@domel\.[a-zA-Z0-9\-\_]*$|^\+=@domel\.[a-zA-Z0-9\-\_]*$|^@domel\.[a-zA-Z0-9\-\_]*.%$|^-@domel\.[a-zA-Z0-9\-\_]*.%$|^-=@domel\.[a-zA-Z0-9\-\_]*.%$|^\+=@domel\.[a-zA-Z0-9\-\_]*.%$|^\(@domel\.[a-zA-Z0-9\-\_]*.\)px$|^-\(@domel\.[a-zA-Z0-9\-\_]*.\)px$|^-=\(@domel\.[a-zA-Z0-9\-\_]*.\)px$|^\+=\(@domel\.[a-zA-Z0-9\-\_]*.\)px$/);
            var randRegex = new RegExp(/^@rand\( *?.+ *?, *?.+ *?\)$|^-@rand\( *?.+ *?, *?.+ *?\)$|^-=@rand\( *?.+ *?, *?.+ *?\)$|^\+=@rand\( *?.+ *?, *?.+ *?\)$|^@rand\( *?.+ *?, *?.+ *?\)%$|^-@rand\( *?.+ *?, *?.+ *?\)%$|^-=@rand\( *?.+ *?, *?.+ *?\)%$|^\+=@rand\( *?.+ *?, *?.+ *?\)%$|^@rand\( *?.+ *?, *?.+ *?\)px$|^-@rand\( *?.+ *?, *?.+ *?\)px$|^-=@rand\( *?.+ *?, *?.+ *?\)px$|^\+=@rand\( *?.+ *?, *?.+ *?\)px$/);
            //var that = this;
            var flaggedWithoutDuration = false;
            if(!properties.options.hasOwnProperty("duration")){
                properties.options.duration = '0.3s';
                flaggedWithoutDuration = true;
            }


            this.animationFunction = function(e, params, callback){
                var parametric = false;
                var random = false;
                // contains objects of format :
                // whichPart (either attributes or options)
                // whichKey (the key of the specific object that should be replaced)
                // byWhichAttr: (the name of the dom element's attribute that will be used)
                var parametrics = [];
                var randoms = [];

                var numberOfAttrs = 0;

                var preActions = [];
                var execPreActions = function(element){
                    for(var i=0; i<preActions.length; i++){
                        preActions[i](element);
                    }
                    return element;
                };

                for(var property in properties.attributes){
                    if(property == '-.'){
                        var className = properties.attributes[property] + '';
                        preActions.push(function(element){
                            element.removeClass(className);
                        });
                        continue;
                    } else if(property == '+.') {
                        var className = properties.attributes[property] + '';
                        preActions.push(function(element){
                            element.addClass(className);
                        });
                        continue;
                    }

                    numberOfAttrs += 1;
                    if(paramsRegex.exec(properties.attributes[property])){
                        var actualPropName = getProperty(properties.attributes[property]);
                        if(params.hasOwnProperty(actualPropName)){
                            properties.attributes[property] = getPrefix(properties.attributes[property]) + params[actualPropName] + getUnits(properties.attributes[property]);
                        } else {
                            MC.log("error", "The variable " + actualPropName + " was expected in the params object but is not present. It will be ignored");
                        }
                    } else if(domelRegex.exec(properties.attributes[property])){
                        parametrics.push({
                            pre:getPrefix(properties.attributes[property]),
                            units:getUnits(properties.attributes[property]),
                            whichPart:'attributes',
                            whichKey:property,
                            byWhichAttr:getProperty(properties.attributes[property])
                        });
                        parametric = true;
                    } else if(randRegex.exec(properties.attributes[property])){
                        var propertyValArray = properties.attributes[property].match(/([^()]+)/g)[1].split(',');
                        randoms.push({
                            pre:getPrefix(properties.attributes[property]),
                            units:getUnits(properties.attributes[property]),
                            whichPart:'attributes',
                            whichKey:property,
                            byWhichRand:[propertyValArray[0].trim()*1, propertyValArray[1].trim()*1]
                        });
                    }
                }

                for(var property in properties.options){
                    if(paramsRegex.exec(properties.options[property])){
                        var actualPropName = getProperty(properties.options[property]);
                        if(params.hasOwnProperty(actualPropName)){
                            properties.options[property] = getPrefix(properties.options[property]) + params[actualPropName] + getUnits(properties.options[property]);
                        } else {
                            MC.log("error", "The variable " + actualPropName + " was expected in the params object but is not present. It will be ignored");
                        }
                    } else if(domelRegex.exec(properties.options[property])){
                        parametrics.push({
                            pre:getPrefix(properties.options[property]),
                            units:getUnits(properties.options[property]),
                            whichPart:'options',
                            whichKey:property,
                            byWhichAttr:getProperty(properties.options[property])
                        });
                        parametric = true;
                    } else if(randRegex.exec(properties.options[property])){
                        random = true;
                        var propertyValArray = properties.options[property].match(/([^()]+)/g)[1].split(',');
                        randoms.push({
                            pre:getPrefix(properties.options[property]),
                            units:getUnits(properties.options[property]),
                            whichPart:'options',
                            whichKey:property,
                            byWhichRand:[propertyValArray[0].trim()*1, propertyValArray[1].trim()*1]
                        });
                    }
                }

                if(numberOfAttrs == 0){
                    execPreActions(this.selectionFunction(properties, e));
                    callback(e, params);
                    return true;
                }  else if(flaggedWithoutDuration){
                    MC.log("error", "The duration has not been defined. The default (0.3s) will be used");
                }

                if(!parametric && !random){
                    properties.options.complete = function(){callback(e, params);};
                    var animatedElements = this.selectionFunction(properties, e);
                    execPreActions(this.selectionFunction(properties, e)).velocity(properties.attributes, properties.options);
                    //console.log(properties);
                } else {
                    var selectedElements = this.selectionFunction(properties, e);
                    var CallbackHandler = {
                        numberOfElements: selectedElements.length,
                        numberOfFinished:0,

                        finished: function(){
                            this.numberOfFinished+=1;
                            if(this.numberOfFinished == this.numberOfElements){
                                callback(e, params);
                            }
                        }
                    };

                    selectedElements.each(function(){
                        var ownAttrs = JSON.parse(JSON.stringify(properties));
                        for(var i=0; i<parametrics.length; i++){
                            //console.log($(this).attr(parametrics[i].byWhichAttr));
                            ownAttrs[parametrics[i].whichPart][parametrics[i].whichKey] = parametrics[i].pre + $(this).attr(parametrics[i].byWhichAttr) + parametrics[i].units;
                        }
                        for(var i=0; i<randoms.length; i++){
                            ownAttrs[randoms[i].whichPart][randoms[i].whichKey] = randoms[i].pre + genRandom(randoms[i]['byWhichRand'][0], randoms[i]['byWhichRand'][1]) + randoms[i].units;
                        }
                        //console.log(ownAttrs.options);
                        ownAttrs.options.complete = function(){CallbackHandler.finished()};
                        execPreActions($(this)).velocity(ownAttrs.attributes, ownAttrs.options);
                    });
                }

            }
        }


        /*
         gets the selector in the format selectionString:@data-x>2@index=2:eventName
         and return a function that when executed will return the items to be animated
         on event trigger.
         The available possible formats are:
         any valid CSS selection
         triggeringElement
         not(triggeringElement)
         expressions
         */
        Thread.prototype.createSelectionFunction = function(selectorArray, findString){
            var expressions = [
                {
                    name:'index greater than',
                    rxp:new RegExp(/^@index\ *?\>\ *?\d+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":gt(" + string.split(":")[1].trim() + ")";
                        };
                    }
                },
                {
                    name:'index less than',
                    rxp:new RegExp(/^@index\ *?\<\ *?\d+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":lt(" + string.split(":")[1].trim() + ")";
                        }
                    }
                },
                {
                    name:'index less or equal to',
                    rxp:new RegExp(/^@index\ *?\<\=\ *?\d+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":lt(" + string.split(":")[1].trim() + "):eq"+ string.split(":")[1].trim() + ")";
                        }
                    }
                },
                {
                    name:'index greater or equal to',
                    rxp:new RegExp(/^@index\ *?\>\=\ *?\d+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":gt(" + string.split(":")[1].trim() + "):eq"+ string.split(":")[1].trim() + ")";
                        }
                    }
                },
                {
                    name:'index equals to',
                    rxp:new RegExp(/^@index\ *?\={2}\ *?\d+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":eq(" + string.split(":")[1].trim() + ")";
                        }
                    }
                },
                {
                    name:'index odd',
                    rxp:new RegExp(/^@index *?odd$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":odd";
                        }
                    }
                },
                {
                    name:'index even',
                    rxp:new RegExp(/^@index *?even$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            return ":even";
                        }
                    }
                },
                // parametric (uses the MotorCortex call parameters)
                {
                    name:'index greater than parameter',
                    rxp:new RegExp(/^@index\ *?\>\ *\@params. ?[a-zA-Z0-9\.\-\_]+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            var key = string.split(":")[1].trim().split('.')[1];
                            if(!params.hasOwnProperty(key)){
                                MC.log("error", "The expected params key " + key + " is not present. The selector will be ignored!");
                                return "";
                            } else {
                                return ":gt(" + params[key] + ")";
                            }
                        };
                    }
                },
                {
                    name:'index less than parameter',
                    rxp:new RegExp(/^@index\ *?\<\ *\@params. ?[a-zA-Z0-9\.\-\_]+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            var key = string.split(":")[1].trim().split('.')[1];
                            if(!params.hasOwnProperty(key)){
                                MC.log("error", "The expected params key " + key + " is not present. The selector will be ignored!");
                                return "";
                            } else {
                                return ":lt(" + params[key] + ")";
                            }
                        };
                    }
                },
                {
                    name:'index less or equal to parameter',
                    rxp:new RegExp(/^@index\ *?\<\=\ *\@params. ?[a-zA-Z0-9\.\-\_]+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            var key = string.split(":")[1].trim().split('.')[1];
                            if(!params.hasOwnProperty(key)){
                                MC.log("error", "The expected params key " + key + " is not present. The selector will be ignored!");
                                return "";
                            } else {
                                return ":lt(" + params[key] + "):eq"+ params[key] + ")";
                            }

                        };
                    }
                },
                {
                    name:'index greater or equal to parameter',
                    rxp:new RegExp(/^@index\ *?\>\=\ *\@params. ?[a-zA-Z0-9\.\-\_]+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            var key = string.split(":")[1].trim().split('.')[1];
                            if(!params.hasOwnProperty(key)){
                                MC.log("error", "The expected params key " + key + " is not present. The selector will be ignored!");
                                return "";
                            } else {
                                return ":gt(" + params[key] + "):eq"+ params[key] + ")";
                            }
                        };
                    }
                },
                {
                    name:'index greater than parameter',
                    rxp:new RegExp(/^@index\ *?\={2}\ *\@params. ?[a-zA-Z0-9\.\-\_]+$/),
                    createSelectionFunction:function(string){
                        return function(params){
                            var key = string.split(":")[1].trim().split('.')[1];
                            if(!params.hasOwnProperty(key)){
                                MC.log("error", "The expected params key " + key + " is not present. The selector will be ignored!");
                                return "";
                            } else {
                                return ":eq(" + params[key] + ")";
                            }
                        };
                    }
                }
            ];

            var plainCSSSelector = function(string){
                return function(params){
                    return string;
                }
            }


            if(Object.prototype.toString.call( selectorArray ) === '[object Array]'){
                var selectorArrayLength = selectorArray.length;

                var selectionFunctions = [];
                var triggeringElementFunction;
                var triggeringElementFunctionFound = false;

                for(var i=0; i<selectorArrayLength - 1; i++){
                    if(selectorArray[i].indexOf('@') != 0){
                        if(selectorArray[i] == "triggeringElement"){
                            if(triggeringElementFunctionFound){
                                MC.log("warn", "The triggering object filter seems to have been applied twice. The second directive will be ignored!");
                                continue;
                            }
                            triggeringElementFunction = function(e){
                                if(e){
                                    return $(e.target);
                                } else {
                                    MC.log("error", "You have included the 'triggeringElement' directive in your selection string on MSS, though you didn't pass the event object on the trigger function. The directive will be ignored");
                                    return $("*");
                                }
                            };
                            triggeringElementFunctionFound = true;
                        } else if(selectorArray[i].replace(/ +?/g, '') == "not(triggeringElement)"){
                            if(triggeringElementFunctionFound){
                                MC.log("warn", "The triggering object filter seems to have been applied twice. The second directive will be ignored!");
                                continue;
                            }
                            triggeringElementFunction = function(e){
                                if(e){
                                    return $("*").not($(e.target));
                                } else {
                                    MC.log("error", "You have included the 'triggeringElement' directive in your selection string on MSS, though you didn't pass the event object on the trigger function. The directive will be ignored");
                                    return $("*");
                                }
                            };
                            triggeringElementFunctionFound = true;
                        } else {
                            selectionFunctions.push(plainCSSSelector(selectorArray[i]));
                        }
                    } else {
                        var found = false;
                        for(var j=0; j<expressions.length; j++){
                            if(expressions[j].rxp.exec(selectorArray[i])){
                                selectionFunctions.push(expressions[j].createSelectionFunction(selectorArray[i]));
                                found = true;
                                break;
                            }
                        }
                        if(!found){
                            MC.log("error", "The selection " + selectorArray[i] + " seems to be invalid. It will be ignored!");
                        }
                    }
                }
                /* returns the selection creation function combining all the expressions and selectors
                 The function returns the jquery selection ready to be used
                 */
                return function(params, e){
                    var filterString = '';

                    for(var i=0; i<selectionFunctions.length; i++){
                        filterString += selectionFunctions[i](params);
                    }

                    //console.log(filterString);

                    if(!triggeringElementFunction){
                        var toreturn = $(filterString);
                    } else {
                        var toreturn = triggeringElementFunction(e).filter(filterString);
                    }

                    if(findString == ''){
                        return toreturn;
                    } else {
                        return toreturn.find(findString);
                    }
                }
            } else {
                return function(params, e){
                    if(findString == ''){
                        return selectorArray(params, e);
                    } else {
                        return selectorArray(params, e).find(findString);
                    }
                }
            }

        };

        var Event = function(loops, id){
            if(!loops){
                loops = 1;
            }


            //console.log('event is going to loop ' + loops + ' times')

            this.threads = [];

            this.addTheThread = function(selector, node){
                this.threads.push(new Thread(selector, node, this));
            }

            this.addReadyThread = function(thread){
                this.threads.push(thread);
            }


            var that = this;
            this.CallbackHandler = {
                numberOfExecutedLeafs: 0,
                numberOfLoopsCompleted: 0,
                eventId:id,

                init: function(numberOfThreads, callback, e, options){
                    this.numberOfThreads = numberOfThreads;
                    this.callbackFunction = callback;
                    this.e = e;
                    this.options = options;
                    return this;
                },

                setLoopTimes:function(loopTimes){
                    loops = loopTimes;
                },


                reset: function(preserveLoop){
                    if(!preserveLoop){
                        this.resetLoop();
                        this.numberOfLoopsCompleted = 0;
                        return this;
                    }
                },

                resetLoop: function(){
                    this.numberOfExecutedLeafs = 0;
                },

                animationEnded: function(){
                    this.numberOfExecutedLeafs+=1;
                    //console.log('logged ' + this.numberOfExecutedLeafs + ' out of ' + this.numberOfThreads);
                    if(this.numberOfExecutedLeafs == this.numberOfThreads){
                        this.numberOfLoopsCompleted += 1;
                        //console.log('logged ' + this.numberOfLoopsCompleted + ' out of ' + loops);
                        if(this.numberOfLoopsCompleted == loops){
                            if(this.eventId != null){
                                if(eventsCallbacks[this.eventId] != null && eventsCallbacks[this.eventId] != undefined){
                                    if(typeof eventsCallbacks[this.eventId] == "string"){
                                        getEventObjectByName(eventsCallbacks[this.eventId]).fire(this.e, this.options, this.callbackFunction);
                                    } else if(Array.isArray(eventsCallbacks[this.eventId])){
                                        for(var i=0; i<eventsCallbacks[this.eventId].length; i++){
                                            getEventObjectByName(eventsCallbacks[this.eventId][i]).fire(this.e, this.options, this.callbackFunction);
                                        }
                                    }

                                    return true;
                                }
                            }
                            this.callbackFunction();
                        } else {
                            this.resetLoop();
                            that.fire(this.e, this.options, this.callbackFunction, true);
                        }
                    }
                }
            };
        };

        Event.prototype.setOverallEventCallback = function(eventName){
            this.parentEvent.setOverallEventCallback();
        };

        /*
         CallbackHandler object takes as parameters the number of ThreadCollections that handles,
         the ParentThread (which is the parent Thread of the ThreadCollection to which it belongs)
         and a callback that is executed whenever all animations have finished
         */

        Event.prototype.addThread = function(selector, node){
            this.addTheThread(selector, node);
        };


        Event.prototype.fire = function(e, options, callback, preserveLoop){
            if(!callback){
                callback = function(){};
            }
            if(!options){
                options = {};
            }

            this.CallbackHandler.init(this.threads.length, callback, e, options, this.fire).reset(preserveLoop);

            for(var i=0; i<this.threads.length; i++){
                //console.log('firing thread');
                this.threads[i].execute(e, options);
            }
        };

        Event.prototype.stop = function(){

        };

        Event.prototype.setLoopTimes = function(loopTimes){
            this.CallbackHandler.setLoopTimes(loopTimes);
        }



        /******************************************************************************************
         *                  CMS TO JSON
         ******************************************************************************************/
        var CMSPARSER = new function () {

            var base = this;

            base.init = function () {
                // String functions
                String.prototype.trim = function () {
                    return this.replace(/^\s+|\s+$/g, '');
                };

                String.prototype.repeat = function (n) {
                    return new Array(1 + n).join(this);
                };
            };
            base.init();

            var selX = /([^\s\;\{\}][^\;\{\}]*)\{/g;
            var endX = /\}/g;
            var lineX = /([^\;\{\}]*)\;/g;
            var commentX = /\/\*[\s\S]*?\*\//g;
            var lineAttrX = /([^\:]+):([^\;]*);/;

            // This is used, a concatenation of all above. We use alternation to
            // capture.
            var altX = /(\/\*[\s\S]*?\*\/)|([^\s\;\{\}][^\;\{\}]*(?=\{))|(\})|([^\;\{\}]+\;(?!\s*\*\/))/gmi;

            // Capture groups
            var capComment = 1;
            var capSelector = 2;
            var capEnd = 3;
            var capAttr = 4;

            var isEmpty = function (x) {
                return typeof x == 'undefined' || x.length == 0 || x == null;
            };

            /**
             * Input is css string and current pos, returns JSON object
             *
             * @param cssString
             *            The CSS string.
             * @param args
             *            An optional argument object. ordered: Whether order of
             *            comments and other nodes should be kept in the output. This
             *            will return an object where all the keys are numbers and the
             *            values are objects containing "name" and "value" keys for each
             *            node. comments: Whether to capture comments. split: Whether to
             *            split each comma separated list of selectors.
             */
            base.toJSON = function (cssString) {
                var node = {
                    children: {},
                    attributes: {}
                };
                var match = null;
                var count = 0;

                var args = {
                    ordered: false,
                    comments: false,
                    stripComments: false,
                    split: false
                };

                while ((match = altX.exec(cssString)) != null) {
                    if (!isEmpty(match[capComment]) && args.comments) {
                        // Comment
                        var add = match[capComment].trim();
                        node[count++] = add;
                    } else if (!isEmpty(match[capSelector])) {
                        // New node, we recurse
                        var name = match[capSelector].trim();
                        // This will return when we encounter a closing brace
                        var newNode = base.toJSON(cssString, args);
                        if (args.ordered) {
                            var obj = {};
                            obj['name'] = name;
                            obj['value'] = newNode;
                            // Since we must use key as index to keep order and not
                            // name, this will differentiate between a Rule Node and an
                            // Attribute, since both contain a name and value pair.
                            obj['type'] = 'rule';
                            node[count++] = obj;
                        } else {
                            if (args.split) {
                                var bits = name.split(',');
                            } else {
                                var bits = [name];
                            }
                            for (i in bits) {
                                var sel = bits[i].trim();
                                if (sel in node.children) {
                                    for (var att in newNode.attributes) {
                                        node.children[sel].attributes[att] = newNode.attributes[att];
                                    }
                                } else {
                                    node.children[sel] = newNode;
                                }
                            }
                        }
                    } else if (!isEmpty(match[capEnd])) {
                        // Node has finished
                        return node;
                    } else if (!isEmpty(match[capAttr])) {
                        var line = match[capAttr].trim();
                        var attr = lineAttrX.exec(line);
                        if (attr) {
                            // Attribute
                            var name = attr[1].trim();
                            var value = attr[2].trim();
                            if (args.ordered) {
                                var obj = {};
                                obj['name'] = name;
                                obj['value'] = value;
                                obj['type'] = 'attr';
                                node[count++] = obj;
                            } else {
                                if (name in node.attributes) {
                                    var currVal = node.attributes[name];
                                    if (!(currVal instanceof Array)) {
                                        node.attributes[name] = [currVal];
                                    }
                                    node.attributes[name].push(value);
                                } else {
                                    node.attributes[name] = value;
                                }
                            }
                        } else {
                            // Semicolon terminated line
                            node[count++] = line;
                        }
                    }
                }

                return node;
            };

            // Helpers

            var strAttr = function (name, value, depth) {
                return '\t'.repeat(depth) + name + ': ' + value + ';\n';
            };

            var strNode = function (name, value, depth) {
                var cssString = '\t'.repeat(depth) + name + ' {\n';
                cssString += base.toCSS(value, depth + 1);
                cssString += '\t'.repeat(depth) + '}\n';
                return cssString;
            };

        };



        /** This function is used for debugging and logging. If mc_debug has been set to true then
         * the logs will be appended to the console of the browser. If the mc_debug has been set to
         * false then no logging will occur
         * @param {String} logging type. One of "log", "info", "warn", "debug", "error"
         * @param {String} A human readable string
         * @param {String} A secondary human readable string that most probably originates from an error catch
         * @example
         *    MotroCortex.log("error", "No MSS file found", err);
         */
        this.log = function(type, log, err){
            if(mc_debug){
                var string = "MotorCortex " + type + ": ";
                string += log;
                if(err){
                    console.log(err);
                    string += " | " + err;
                }
                console[type](string);
            }
        };


        /** This function is used for loading the MSS files and initiate the MotorCortex functionality
         * @param {Array} or {String}
         */
        this.loadMSS = function(files, callback){
            var that = this;

            if(!window.jQuery){
                this.log("error", "jQuery has not been loaded. Please load jQuery before MotorCortex.loadMSS invocation");
                this.execute = function(){
                    this.log("error", "jQuery has not been loaded");
                };
                return false;
            }

            var filesToScan;
            if( Object.prototype.toString.call( files ) != '[object Array]' ){
                if( typeof files === 'string' ) {
                    filesToScan = [files];
                } else {
                    this.log("error", "Unidentified / Unsupported files attribute type. Currently supported only array and string");
                    return false;
                }
            } else {
                filesToScan = files;
            }

            var filesLength = filesToScan.length;

            var LoadCallbackHandler = {
                totalLoaded:0,

                fileLoaded: function(){
                    LoadCallbackHandler.totalLoaded += 1;

                    if(LoadCallbackHandler.totalLoaded === filesLength){
                        callback();
                    }
                }
            };

            for(var i=0; i<filesLength; i++){
                var currentlyScanning = filesToScan[i];
                $.ajax({
                    url: currentlyScanning,
                    type: 'GET',
                    async: true,
                    success:function(cssString){
                        var json = CMSPARSER.toJSON(cssString);
                        compile(json, LoadCallbackHandler.fileLoaded);
                    },
                    error:function(err, textStatus, errorThrown){
                        that.log("error", "The MSS file " + currentlyScanning + " seems to be missing", errorThrown);
                    }
                });
            }
        }

    };
})(window);
