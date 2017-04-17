<h1>motorcortexjs</h1>
=============

<h2>Website</h2>
<a href="http://motorcortexjs.com/" target="_blank">http://motorcortexjs.com</a>

<h2>Intro</h2>
How would you like to decouple and take all the animations logic, of your web applications, completely out of your javascript code?<br/>
How would you like to define your animations in a CSS-like syntax on external files and just trigger custom events in order to execute them?<br/>
If all these sound interesting read on.

<p>
MotorCortex.js aspires to mimic the human brain's motor cortex by providing a new layer of software abstraction that handles and describes the movement of the various elements of an html application in a way that all timed effects doesn't interfere with the logic (decision making) layer of the software and plus each "transition" is treated as a matter of the whole application body and not of each element alone.
And all this with an easy and straight forward CSS-like syntax and a js API that respects and matches all the modern MV* javascript frameworks.
</p>

<h2>License</h2>
Released under the <a href="http://sam.zoy.org/wtfpl/" target="_blank">WTFPL</a> license. Andreas Trantidis <a href="https://twitter.com/AndreasTrantidi" target="_blank">@AndreasTrantidi</a>

<h2>Compatibility and Dependencies</h2>
<h3>Browser support</h3>
<ul>
  <li>Internet Explorer 8+</li>
  <li>Mozilla Firefox 1.5+</li>
  <li>Safari 3+</li>
  <li>Opera 9.5+ (9.01+ as of 1.10)</li>
  <li>Google Chrome 1.0+</li>
  <li>iOS 2.0+</li>
  <li>Opera Mini (to a certain degree)</li>
</ul>
<h3>Dependencies</h3>
<ul>
    <li>jQuery</li>
    <li><a href="https://github.com/julianshapiro/velocity" target="_blank">velocity.js</a></li>
</ul>

<h3>Bower</h3>
Package name: MotorCortex.js

<h3>npm</h3>
Name: motor-cortex-js

<h2>The basics</h2>
MotorCortex.js provides the ability to define / describe animations and (animated) transitions between states through a CSS (or even LESS) - like syntax.
<br/>
The library is event driven. The developer can define the behavior of DOM elements whenever an event is triggered. This behavior is
defined on external MSS (Motor Style Sheet) file(s) (*.mss) which get loaded using a simple load function (loadMSS).
<br/>
During the mss files load, the library reads and renders the CSS-like code to javascript objects that handle the animations
accordingly, whenever an event gets triggered.
<br/>
Events are triggered using the library's most important function (that's "trigger"). The "trigger" function always takes
as its first parameter a string which represents the name of the (custom) event to be triggered. The library, then,
uses the proper javascript objects and executes the (sequence) of, the defined on the mss file, animations.
<br/>
MotorCortex.js uses <a href="http://julian.com/research/velocity/" target="_blank">velocity.js</a> as its underlying animation library.
Velocity.js performs better than jQuery animations and is also faster than CSS animation libraries, something that makes
MotrorCortex.js animations extremely smooth.

<h2>Loading the library</h2>
The MotorCortex library depends on jQuery and velocity.js. velocity.js depends on jQuery too, so you should include these
two libraries in the jQuery/velocity sequence before including MotorCortex on your page.
<br/>
<pre lang="html"><code>
&lt;script src=&quot;//code.jquery.com/jquery-1.11.0.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;path/to/jquery.velocity.min.js&quot;&gt;&lt;/script&gt;
&lt;script src=&quot;path/to/MotorCortex.js&quot;&gt;&lt;/script&gt;
</code></pre>

<h2>Working with npm and browserify</h2>
In order to use MotorCortex with browserify you need to install it through npm
<code>npm install motor-cortex-js</code>
On any place of your code you need to do the following:
<br/>
<pre lang="javascript"><code>
global.jQuery = require('jquery');
global.velocity = require('velocity-animate');
var MotorCortex = require('motor-cortex-js');

/* and proceed normally */

var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    // here you are sure the MotorCortex loaded and rendered the MSS files
});
</code></pre>
<br/>
MotorCortex depends on jQuery and velocity, so make sure you include both on your package.json file or install them
manually. The corresponding npm packages are:<br/>
<ul>
<li>jquery</li>
<li>velocity-animate</li>
</ul>

<h2>Loading the MSS files</h2>
All animations are defined in MSS files. Once you've loaded both the library and its dependencies you can load one or more MSS
files at once using the "loadMSS" function:
<br/>
<pre lang="javascript"><code>
var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    // here you are sure the MotorCortex loaded and rendered the MSS files
});
</code></pre>
<br/>
loadMSS function takes two parameters. This first parameter can be either a string pointing the one and only MSS
file you want to load or an array of strings, each pointing to a different MSS file.
<br/>
The second parameter is a callback function called when the loading and rendering process finishes.

<h2>MSS syntax / Triggering events</h2>
<h3>Quick example</h3>
The following code defines the behavior of the elements of class ".section" and ".section2" when the event with name "myEvent"
fires:<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:400;
    top:+=300px;
}

.section2:myEvent{
    duration:300;
    top:-=300px;
}
</code></pre>
<br/>
This code indicates that when the event with the name "myEvent" fires all elements of class "section" will animate top
by 300 pixels in 400ms and all elements of class "section2" by 300 pixels in 300ms.
<br/>
Triggering an event is easy. After loading the library and the mss files we call the MotorCortex's "trigger" method. At
the specific example this is as easy as this:
<br/>
<pre lang="javascript"><code>
var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    mc.trigger('myEvent');
});
</code></pre>

<h3>The trigger function</h3>
The trigger function takes from 1 up to 4 parameters:<br/>
<ul>
    <li>eventName: the name of the event to trigger</li>
    <li>e [optional]: a javascript event object. This is passed when we want to know the target of an action that caused an event to fire. We'll see more later on about this</li>
    <li>params [optional]: an object containing animation parameters. These parameters (with the right MSS syntax) can be used on run time in order to assign custom values to animation parameters</li>
    <li>callback [optional]: a callback function to call when the animation of the event finishes</li>
</ul>
A full example, using all the parameters is the following:
<br/>
<pre lang="javascript"><code>
var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    $('button').click(function(e){
        mc.trigger('myEvent', e, {top:'300px'}, function(){
            console.log('event animation finished!');
        });
    });
});
</code></pre>
<br/>
All the following method invocations are valid:<br/>
<pre lang="javascript"><code>
mc.trigger(eventName);
mc.trigger(eventName, e);
mc.trigger(eventName, e, params);
mc.trigger(eventName, e, params, callback);
mc.trigger(eventName, e, callback);
mc.trigger(eventName, params);
mc.trigger(eventName, params, callback);
mc.trigger(eventName, callback);
</code></pre>

<h3>Animation parameters and characteristics</h3>
There are two kinds of parameters that we can define for an animation:
<ul>
    <li><b>The animation parameters</b>: These parameters define the CSS attributes that we want to alter during an animation</li>
    <li><b>The animation characteristics</b>: These options define the animation characteristics</li>
</ul>
<h4>Animation parameters</h4>
The "animation parameters" define the CSS attributes of the selected elements that are going to get animated during an animation.<br/>
MotorCortex.js uses <a href="http://julian.com/research/velocity/" target="_blank">velocity.js</a> as its underlying animation mechanism.
The animation parameters supported by MotorCortex are identical with the ones supported by velocity.js. In general, these
parameters are identical with any valid CSS parameter (e.g. width, height, top, left, etc).
<br/>Though, there are some major differences when it comes to transforms and colors. You can check these two links for more information:<br/>
<a href="http://julian.com/research/velocity/#transforms" target="_blank">Supported transforms</a><br/>
<a href="http://julian.com/research/velocity/#colors" target="_blank">Dealing with colors</a>
<br/>
Animation parameters can be expressed in absolute values on your MSS files (such as):
<pre lang="css"><code>
.section:myEvent{
    duration:400;
    top:300px;
}
</code></pre>
, can be followed by any valid unit (such as):
<ul>
    <li>%</li>
    <li>px</li>
    <li>deg</li>
    <li>etc</li>
</ul>
, can be negative (by using the "-" operator) <br/>
and can, also be relative by using the proper operators (such as):
<ul>
    <li>-=</li>
    <li>+=</li>
</ul>
<h4>Animation characteristics</h4>
The "animation characteristics" define the characteristics of an animation. The list of the available characteristics is:
<ul>
    <li><b>duration</b>: expressed in integer number. Defines the milliseconds that the animation will last</li>
    <li><b>delay</b>: expressed in integer number. Defines the milliseconds that the animation will delay before starting</li>
    <li><b>easing</b>: defines the easing of the animation. You can use any value from <a href="http://easings.net/" target="_blank">this list</a>,
        pass in a four-item array of bezier points. (Refer to <a href="http://cubic-bezier.com/" target="_blank">Cubic-Bezier.com</a>
        for crafing custom bezier curves.) or use CSS3 named easings ("ease", "ease-in", "ease-out", and "ease-in-out").</li>
</ul>
Here is an example:
<pre lang="css"><code>
.section:myEvent{
    duration:400; /* the animation will last 400ms */
    delay:300; /* the animation will delay 300ms before executing */
    easing:easeInElastic
    top:-=300px;
}
</code></pre>

<h3>Globals and nested elements</h3>
Just like in LESS, MotorCortex supports global variables and nested elements.
<h4>Globals</h4>
Global variables are defined in the top of each MSS document and can be used all over it in this manner:<br/>
<pre lang="css"><code>
@myGlobalDuration:300;
@myGlobalTop:300px;

.section:myEvent{
    duration:@globals.myGlobalDuration;
    top:@globals.myGlobalTop;
}
</code></pre>
As shown on the example, in order to define a global variable you just define its value using the "@" character as the first
of the definition string.<br/>
You can use any of the defined global variables within the MSS file by using the expression:<br/>
@globals. followed by the global variable name (this time without the precedent "@".

<h4>Nested elements</h4>
There are occasions that we want to define animations for an element and also, different animation behavior for its nested
elements. For example, let's suppose that we want to animate the top value of all elements of class "section" and also
to rotate the images contained to these elements by 90deg.<br/>
We could just write:<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:300;
    top:+=300px;
}

.section img:myEvent{
    duration:300;
    rotateZ:90deg;
}
</code></pre><br/>
With the nested elements capability provided by MotorCortex you can just write:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:300;
    top:+=300px;

    img{
        /* no need to redefine the duration property. It is inherited from the parent */
        rotateZ:90deg;
    }
}
</code></pre><br/>
As you can see we've not included the "duration" option on the img scope. Nested elements automatically inherit the animation
characteristics from their parents. Though you can always change / overwrite these options if you want. Using the following
syntax the img elements will animate in 400ms and not in 300:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:300;
    top:+=300px;

    img{
        duration:400;
        rotateZ:90deg;
    }
}
</code></pre><br/>

<h3>Runtime parameters</h3>
As mentioned, we can pass run-time variables through the "trigger" function. These parameters dynamically define (on invocation time)
the value of selected animation parameters and characteristics.<br/>
The following MSS code has been written in a way that expects for these dynamic params to be based on "trigger" invocation:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:@params.duration;
    top:+=(@params.top)px; /* always put in parenthesis dynamic variables (both @globals.xxx and @params.xxx) when you want to follow them by the "px" units */
}
</code></pre><br/>
As you can see in the example we've put in parenthesis the @params.top variable. This is because without the parenthesis the code would look like this:
<br/>
<b>wrong syntax!!</b>
<pre lang="css"><code>
.section:myEvent{
    duration:@params.duration;
    top:+=@params.toppx; /* no way to make clear where the param name ends end if the "px" is part of it or represents the units */
}
</code></pre><br/>
As you can see there is no way to separate the @params.top from the "px" units. This is why and when you should use parentheses when
working with parametric values.<br/>
Going back to our example, we've prepared our MSS to accept dynamic parameters from the trigger function. It's time to
see how this is implemented from the javascript side. A proper way to call the trigger function for this example is the
following:<br/>
<pre lang="javascript"><code>
var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    mc.trigger('myEvent', {duration:300, top:250});
});
</code></pre>
By this invocation the transition will execute in 300ms making the .section elements top equals to 250px. <br/>
Not passing in an expected, from the MSS code, parameter will cause MotorCortex to complete ignore the directive stated on the MSS.

<h3>DOM elements attributes</h3>
There are occasions that we want each DOM element participating in an animation, to animate according to a specific (own) value.
This is totally feasible with MotorCortex by using DOM element attributes.<br/>
Let's consider the following example:
<br/>
<b>MSS</b>
<pre lang="css"><code>
.section:myEvent{
    delay:@domel.data-delay;
    top:+=(@domel.data-top)px; /* always put in parenthesis dynamic variables (both @globals.xxx and @params.xxx) when you want to follow them by the "px" units */
}
</code></pre><br/>
As you can see in the MSS code we've used the @domel.delay and @domel.top directives for the value assignment to the delay and top variables.
This syntax defines the delay equal to the "data-delay" value of each element of class "section" and that the
"top" attribute's value will be equal to the "data-top" attribute of each.
<br/>
The javascript code is very simple in such an occasion. A simple trigger call is enough.<br/>
What matters though is the HTML. As mentioned the delay and top values are going to be retrieved from the animated DOM
elements' attributes. So, each of them should have this attributes on its tag.
<br/>A proper HTML for the specific example is the following:
<br/>
<b>HTML</b>
<pre lang="html"><code>
    &lt;div class=&quot;section&quot; data-delay=&quot;50&quot; data-top=&quot;150&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;section&quot; data-delay=&quot;100&quot; data-top=&quot;200&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;section&quot; data-delay=&quot;150&quot; data-top=&quot;250&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;section&quot; data-delay=&quot;200&quot; data-top=&quot;300&quot;&gt;&lt;/div&gt;
    &lt;div class=&quot;section&quot; data-delay=&quot;250&quot; data-top=&quot;350&quot;&gt;&lt;/div&gt;
</code></pre><br/>

<h3>Selectors</h3>
As shown, each MSS node starts with the selection part. The selection part defines two things:<br/>
<ul>
    <li>The elements that are going to be animated</li>
    <li>The name of the event that this animation is going to be triggered</li>
</ul>
For example on the following code:<br/>
<pre lang="css"><code>
.section:myEvent{
    delay:@domel.data-delay;
    top:+=(@domel.data-top)px;
}
</code></pre><br/>
the selection part is the expression: <b>.section:myEvent</b>.<br/>
Selections are executed on nested elements too. For example, consider this MSS code:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:300;
    top:+=300px;
    img{
        rotateZ:90deg;
    }
}
</code></pre><br/>
The selector parts are:
<ul>
    <li>.section:myEvent</li>
    <li>img</li>
</ul>
<br/>
A major difference between nested and top selectors is that on top selectors we <b>always</b> should define the event name.
On nested selectors we <b>never</b> define the event name. Just the actual selection part.<br/>
A top selection part has the following format:<br/>
CSS selection:extra filter:extra filter:....:eventName <br/>
A nested selection part has the followng format:<br/>
CSS selection:extra filter:extra filter:....:extra filter<br/>
By "extra filters" we mean some extra selection methods of the MSS syntax. There are two categories of extra filters that MSS provides:<br/>
<b>The @index selection</b><br/>
MotorCortex provides the ability to select (~filter) elements according to their index. By "index" we mean the number of
the indexed position of the element within the dom compared to the rest of the selected items. The indexing starts from 0,
so the first element on a group of elements has the @index=0, the second @index=1 and so on.<br/>
The provided @index filters are the following [X means integer number throughout the scope of the whole table]:<br/>
<table width="100%" cellspacing="0" cellpadding="0">
    <tr>
        <td>#</td>
        <td><b>Operation</b></td>
        <td><b>Syntax</b></td>
        <td><b>Example</b></td>
    </tr>
    <tr>
        <td>1</td>
        <td>index greater than</td>
        <td>@index>X</td>
        <td>.section:@index>3</td>
    </tr>
    <tr>
        <td>2</td>
        <td>index less than</td>
        <td>@index<X</td>
        <td>.section:@index<3</td>
    </tr>
    <tr>
        <td>3</td>
        <td>index less or equal to</td>
        <td>@index<=X</td>
        <td>.section:@index<=3</td>
    </tr>
    <tr>
        <td>4</td>
        <td>index greater or equal to</td>
        <td>@index>=X</td>
        <td>.section:@index>=3</td>
    </tr>
    <tr>
        <td>5</td>
        <td>index equals to</td>
        <td>@index==X</td>
        <td>.section:@index==3</td>
    </tr>
    <tr>
        <td>6</td>
        <td>index odd</td>
        <td>@index odd</td>
        <td>.section:@index odd</td>
    </tr>
    <tr>
        <td>7</td>
        <td>index even</td>
        <td>@index even</td>
        <td>.section:@index even</td>
    </tr>
</table>
<br/>
You can use the @params.xxx as the second argument of all selections. For example the following syntax is valid:<br/>
.section:@index>=@params.xxxx
<br/><br/>
<b>The triggeringElement selection</b>
Let's suppose that we have a number of list items. We want each item gets clicked to execute an animation where all the
rest of the items scale down to 0.3 and the clicked one up to 1.5. On MotorCortex we call the element that triggered an
event as "triggering element" and we refer to it by the keyword "triggeringElement". We can either refer to it on selection
this way:<br/>
<pre lang="css"><code>
.section:triggeringElement:myEvent{
    duration:300;
    top:+=300px;
}
</code></pre><br/>
or either exclude it from the selection using the following syntax:
<br/>
<pre lang="css"><code>
.section:not(triggeringElement):myEvent{
    duration:300;
    top:+=300px;
}
</code></pre><br/>
MotorCortex doesn't actually "know" which the triggering element was for each event. We must inform it by passing the "e"
variable on the "trigger" method. Continuing the same example, the following javascript code would be correct:<br/>
<pre lang="javascript"><code>
var mc = new MotorCortex();
mc.loadMSS('./path/to/my_mss.mss', function(){
    $('.section').click(function(e){
        mc.trigger('myEvent', e);
    });
});
</code></pre><br/>
From the variable e, that represents the event, MotorCortex will find out and filter accordingly the animations.


<h3>The "complete" keyword</h3>
You can define sequences of animations using the "complete" keyword. For example, let's assume that we want all elements
of class "section" to animate left by 200px and then fade out in 300ms when the event with name "myEvent" gets triggered.
This can easily be done using the "complete" keyword
on our MSS syntax:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:200;
    left:+=200px;
    complete{
        opacity:0;
        duration:300;
    }
}
</code></pre><br/>
You can nest as many completes within completes as you want. Also, exactly as on nested elements, the animation characteristics
are inherited from the parent (and can be overwritten).<br/>
In cases that you use @domel attributes the complete process runs after ALL the elements have completed the animation.
The attributes that we define within the complete scope refer to the elements of the parent node. In our example the elements
of class "section" are the ones that will execute the animation defined on the complete section. <br/>
So, on the complete section we are still working with the selected items, picked form the parent node selector. A LESS-like
nested elements definition still applies within the complete section.<br/>
Example: let's assume we want the elements of class "section" to animate moving to 200px left in 300ms and then rotate all
the images that each contains by 90 degrees in 100ms. We can do that using the following syntax:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:300;
    left:200px;
    complete{
        img{
            rotateZ:90deg;
            duration:100;
        }
    }
}
</code></pre><br/>


<h3>Looping</h3>
MotorCortex MSS syntax provides the "loop" keyword. By assigning a value to the loop attribute of a section, the animation
loops as many times as the assigned value.<br/>
Loops only have true meaning for sequences (when there are "complete" directives). For example, consider the following MSS code:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:200;
    left:200px;
    loop:5;
}
</code></pre><br/>
The first time that the animation will be executed the elements of class "section" will be animated left to 200px. If we
repeat the same animation step nothing will really happen as the elements will start and end their movement from the exact same
spot.<br/>
Loops apply to sections where callbacks have been defined through the "complete" keyword. On our example the whole process (including the callback)
will be executed 4 times:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:200;
    left:200px;
    complete{
        left:0;
        duration:200;
    }
    loop:4;
}
</code></pre><br/>

<h3>Stop</h3>
You can easily stop the animation of any animating element at any time. The only thing that you need to do is to create
an event and after picking the elements you want to stop on this event just pass "stop:true" on the body of the selection.
<br/>Let's suppose that on the event "stopAnimation" you want to stop animating all elements of class ".item". The only
thing you need to do is to define on your mss file the corresponding event, set your selector and pass the command:
<br/>
<pre lang="css"><code>
.item:stopEvent{
    stop:true;
}
</code></pre><br/>
This way all items with class ".item" will stop exactly where they are once the "stopEvent" event gets triggered.<br/>
On a block that includes the stop command all other properties will be ignored except the "complete". That means that after
stopping animation of any element in the page you can proceed by any other action by using the "complete" keyword, as regular.<br/>

<h3>Reverse</h3>
MotorCortex supports reverse of any animation. If you want to reverse the last animation of any element in your DOM just
pass the "reverse:true" parameter within the body of your selection. All properties (such as delay, duration, etc) apply as usual
on blocks that execute reverse. You can either use parametric values as usual.<br/>
It's good to always stop the animation of any element before reversing otherwise the behaviour might be unpredictable. That's
easy to do by creating a block that executes the stop command and on the complete block has the command reverse. Here's an
example that demonstrate how to stop and reverse the animation of all elements of class ".item":
<br/>
<pre lang="css"><code>
.item:stopAndReverse{
    stop:true;
    complete{
        reverse:true;
        duration:200;
    }
}
</code></pre><br/>


<h3>Events sequencing</h3>
MotorCortex lets you define sequences of events (sequencial execution of events). You can define which event you want to
trigger when an event ends by entering to the global (top) scope of any MSS file the directive:<br/>
<br/>
<pre lang="css"><code>
theNameOfTheAnimationThatEnds:callback{
    eventName:theNameOfTheAnimationToFollow;
}
</code></pre><br/>
You can even trigger multiple events after an event completes by entering multiple "eventName" attributes within the
callback node:
<br/>
<pre lang="css"><code>
theNameOfTheAnimationThatEnds:callback{
    eventName:theNameOfTheAnimationToFollow;
    eventName:theNameOfASecondAnimationToFollow;
    eventName:theNameOfAThirdAnimationToFollow;
}
</code></pre><br/>

<h3>Random values</h3>
Anywhere in your MSS file you can use the @rand() function provided. The rand function has the following syntax:<br/>
<pre lang="javascript"><code>
@rand(min, max)
</code></pre><br/>
and returns a random number that's equal or greater than min and less or equal than max. <br/>
An example of @rand usage is the following:
<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:@rand(250,350);
    left:(@rand(100,200))px;
}
</code></pre><br/>

<h3>Adding and removing classes</h3>
Sometimes during an animation it's useful to either add or remove classes from the animated elements. This not only
applies alterations on the elements' appearance but also provides a way to change the groups of elements to animate on
following animations dynamically.<br/>
MSS provides the ability to dynamically add and remove classes to elements by the keywords:<br/>
<pre lang="css"><code>
-. /* remove class */
+. /* add class */
</code></pre><br/>
<br/>
Example:<br/>
<pre lang="css"><code>
.section:myEvent{
    duration:@rand(250,350);
    left:(@rand(100,200))px;
    complete{
        -.:classA;
        +.:classB;
        duration:250;
        left:-=200;
    }
}
</code></pre><br/>
The process of adding or removing classes to elements is always executed BEFORE the actual animation process. In our example
the elements of class "section", when entering the "complete" section of the animation, they will first remove the class
"classA" and add the class "classB" and THEN they will animate left by -200 px.


<h3>Scroll</h3>
As defined on velocity's website the scroll command is supported so you can easily scroll the window to the top
of any element of the webpage.<br/>
In order to do that just put "scroll:true" to the animation attributes of any element.<br/>
Example: <br/>
<pre lang="css"><code>
# section:myEvent{
    duration:300;
    scroll:true;
}
</code></pre><br/>
This way, whenever the "myEvent" gets fired by MotorCortex the window will scroll to the top of the "#section"
element of the webpage.<br/>
Make sure the selection ("#section" on this example) refers to just one element on the webpage to avoid strange
behaviour of the animation. Also, keep in mind that the scroll command gets executed separately (in parallel)
with any other animation defined for a section. If on a section there's only the "scroll" command the complete
keyword / functionality is not supported.