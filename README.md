<h1>motorcortexjs</h1>
=============

<p>
MotorCortex.js aspires to mimic the human brain's motor cortex by providing a new layer of software abstraction that handles and describes the movement of the various elements of an html application in a way that all timed effects doesn't interfere with the logic (decision making) layer of the software and plus each "transition" is treated as a matter of the whole application body and not of each element alone.
And all this with an easy and straight forward CSS-like syntax and a js API that respects and matches all the modern MV* javascript frameworks.
</p>

<h2>The basics</h2>
MotorCortex.js provides the ability to define / describe animations and (animated) transitions between states through a CSS (or even LESS) - like syntax.
<br/>
The library is event driven. The developer can define the behavior of DOM elements whenever an event is triggered. This behavior is
defined on external MSS (Motor Style Sheet) file(s) (*.mss) which are get loaded by the library using a simple load function (loadMSS).
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
    mc.fire('myEvent');
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
        mc.fire('myEvent', e, {top:'300px'}, function(){
            console.log('event animation finished!');
        });
    });
});
</code></pre>
<br/>
All the following method invocations are valid:<br/>
<pre lang="javascript"><code>
mc.fire(eventName);
mc.fire(eventName, e);
mc.fire(eventName, e, params);
mc.fire(eventName, e, params, callback);
mc.fire(eventName, e, callback);
mc.fire(eventName, params);
mc.fire(eventName, params, callback);
mc.fire(eventName, callback);
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
    mc.fire('myEvent', {duration:300, top:250});
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
    <div class="section" data-delay="50" data-top="150"></div>
    <div class="section" data-delay="100" data-top="200"></div>
    <div class="section" data-delay="150" data-top="250"></div>
    <div class="section" data-delay="200" data-top="300"></div>
    <div class="section" data-delay="250" data-top="350"></div>
</code></pre><br/>

<h3>Selectors</h3>


<h3>The "complete" keyword</h3>

<h3>Looping</h3>

<h3>Random values</h3>