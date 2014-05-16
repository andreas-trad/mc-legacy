window.MotroCortex = function(options){
    var mc_debug = options.hasOwnProperty('debug')?options.debug:false;
    var globals = [];
    var events = [];

    var MC = this;

    var optionsNames = ["duration", "easing", "delay", "complete", "loop"];

    var compile = function(topNode){
        for(var property in topNode.attributes){
            var globalsRegx = new RegExp(/^@[a-zA-Z0-9\.\-\_]*?/);

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
            // 1.a Split the expression
            var selectorArray = property.split(":");

            // 1.b Check that the newly created array is at least of length 2
            if(selectorArray.length < 2){
                MC.log("error", "The MC selection and event part " + property + " is not valid. Each MC selection string should consist by least a selection string and an event name" +
                    " separated by the ':' character.");
            } else {
                if(!events.hasOwnProperty(selectorArray[selectorArray.length - 1])){
                    var event = new Event();
                    event.addThread(selectorArray, topNode.children[property]);
                    events[selectorArray[selectorArray.length - 1]] = event;
                } else {
                    event.addThread(selectorArray, topNode.children[property]);
                }
            }
        }



        this.createStep = function(selector, attributes){
            var properties = {};
            var options = {};

            for(var property in attributes){
                if(optionsNames.indexOf(property) != -1){
                    options[property] = attributes[propery];
                } else {
                    properties[property] = attributes[property];
                }
            }

            var selectorArray = selector.split(":");

            var selectorArrayLength = selectorArray.length;
            for(var i=0; i<selectorArrayLength; i++){
                
            }

        };
    };

    var PlainNodeHandler = function(node){

    };

    var Step = function(){
        var functions = [];
    };

    Step.prototype = (function(){
        var callbackHandler = {

        };
    }());

    /*
    Creates the Thread object
    It returns an array containing any extra Threads that might come up during the node analysis.
    New Threads come up if in the body of the actual Thread's node should be separated in more than one
     */
    var Thread = function(selector, node){
        var steps = [];
        var selectionFunction = this.createSelectionFunction(selector);

        var extraThreads = [];


    };

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
    Thread.prototype.createSelectionFunction = function(selectorArray){
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
                        return $(e.target);
                    };
                    triggeringElementFunctionFound = true;
                } else if(selectorArray[i].replace(/ +?/g, '') == "not(triggeringElement)"){
                    if(triggeringElementFunctionFound){
                        MC.log("warn", "The triggering object filter seems to have been applied twice. The second directive will be ignored!");
                        continue;
                    }
                    triggeringElementFunction = function(e){
                        return not($(e.target));
                    };
                    triggeringElementFunctionFound = true;
                }

                selectionFunctions.push(function(){
                    return selectorArray[i];
                });
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

            for(var i=0; i<selectionFunctions; i++){
                string += selectionFunctions[i](params);
            }

            if(triggeringElementFunction){
                return $(filterString);
            } else {
                return triggeringElementFunction.filter(filterString);
            }
        }
    };

    var Event = function(){
        var threads = [];

        this.addTheThread = function(selector, node){
            threads.push(new Thread(selector, node));
        }
    };

    Event.prototype.addThread = function(selector, node){
        this.addTheThread(selector, node);
    };

    Event.prototype.fire = function(e, options, callback){

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
    this.loadMSS = function(files){
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
        for(var i=0; i<filesLength; i++){
            var currentlyScanning = filesToScan[i];
            $.ajax({
                url: currentlyScanning,
                type: 'GET',
                async: true,
                success:function(cssString){
                    var json = CMSPARSER.toJSON(cssString);
                    compile(json);
                },
                error:function(err, textStatus, errorThrown){
                    that.log("error", "The MSS file " + currentlyScanning + " seems to be missing", errorThrown);
                }
            });
        }
    }

};