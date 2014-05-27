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
    <script src="//code.jquery.com/jquery-1.11.0.min.js"></script>
    <script src="path/to/jquery.velocity.min.js"></script>
    <script src="path/to/MotorCortex.js"></script>
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
loadMSS function takes exactly one parameter. This parameter can be either a string pointing the one and only MSS
file you want to load or an array of strings, each pointing to a different MSS file.