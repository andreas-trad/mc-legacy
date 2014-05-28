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

<h3>Animation parameters and options</h3>
There are two kinds of parameters that we can define for an animation:
<ul>
    <li><b>The animation parameters</b>: These parameters define the CSS attributes that we want to alter during an animation</li>
    <li><b>The animation options</b>: These options define the animation characteristics</li>
</ul>
<h4>Animation parameters</h4>
MotorCortex.js uses <a href="http://julian.com/research/velocity/" target="_blank">velocity.js</a> as its underlying animation mechanism.
The animation parameters supported by MotorCortex are identical with the ones supported by velocity.js. In general, these
parameters are identical with any valid CSS parameter (e.g. width, height, top, left, etc).
<br/>Though, there are some major differences when it comes to transforms and colors. You can check these two links for info:
<a href="http://julian.com/research/velocity/#transforms" target="_blank">Supported transforms</a><br/>
<a href="http://julian.com/research/velocity/#colors" target="_blank">Dealing with colors</a>



