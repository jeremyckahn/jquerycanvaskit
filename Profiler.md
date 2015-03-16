# What is the performance profiler? #

The performance profiler is a little draggable popup that will give you a live readout of the values and properties for a kitted canvas.  By default, it has the capability to tell you which JCK options are set and actual frames per second.  It can be extended with your own custom values.

# Actual frames per second vs. attempted frames per second #

The JCK is designed run as close to the speed specified by `options.framerate` as possible.  In actuality, that's not possible.  The actual framerate will always be a little higher or lower than than `options.framerate`, but in most cases, it is not apparent to the user.  In situations where your app is using a lot of your computer's resources (RAM, CPU), the actual framerate may dip well below the desired framerate.  Applications may also run at a lower framerate on slower hardware.  The profiler will help you identify these situations.

# Profiler setup #

With all that out of the way, how do we set up and use the profiler?  Let's built off of the example we started in the [run loop](Run_loop.md) article.  Here it is again, for convenience:

```
<script type="text/javascript">
/// Define some global values, it looks nicer this way (and is easier to modify later)	
var global = {
	x : 10,
	y : 40,
	radius : 30,
	ballColor : '#f0f',
	canvasColor : '#222',
	canvasHeight : 100,
	canvasWidth : 400
};

// Execute this code when the document loads
$(document).ready(function(){
	$("canvas").each(function(){
		// Initialize "this," which is a canvas as defined by the jQuery selector above
		jck(this,{
			framerate 		: 20,
			autoUpdate 		: true,
			autoClear 		: true
		});
		
		// Use the JCK setHeight() and getHeight() functions to give the dimensions
		// as defined by our "global" variable
		this.setHeight(global.canvasHeight);
		this.setWidth(global.canvasWidth);
		
		// Give the canvas a color so that we know it's there
		$(this).css({'background' : global.canvasColor});
		 
		//  Look at this!  We're overriding the run loop!  This code executes every frame,
		//  which occurs 20 times a second (as specified when we called jck())
		this.runloop = function(){
			// Move the ball's x coordinate up one
			global.x++;
			
			// Do some standard canvas element calls to draw a big purple ball.
			// Don't worry if this block doesn't make any sense yet.
			this.context.beginPath();
			this.context.arc(global.x, global.y, global.radius, 0, Math.PI*2, true);
			this.context.fillStyle = global.ballColor;
			this.context.fill();
			this.context.closePath();
		 };
	});
});

</script>
```

Ok, so now all we have to do in order to initialize the profiler is call `createProfiler()` on the kitted canvas since `this` is a `canvas` within the context of our jQuery `each()` function.  We can just call:

```
	this.createProfiler();
```

Inside of the `each()`.  Don't worry, I'll put this all together for you at the end of this section in case you get lost.

There are two ways to update the profiler, have the JCK do it automatically or code it ourselves.  Letting the JCK do it is easier, but we can't customize it.  For now, we will relinquish control to the JCK just to get something up and running.

After calling `createProfiler()`, we will call `togglePause()` and set `autoUpdate` to `true`.  Like this:

```
	this.createProfiler();
	this.toggleProfiler();
	this.options.autoUpdateProfiler = true;
```

Viola!  We now have a profiler.  Go ahead, drag it around!  If we want to measure the framerate, simply set `sampleFrames` to `true`.  Example:

```
	this.options.sampleFrames = true;
```

Of course, we could set these options when we called `jck()` as well.  The reason these options are not both set by default is because having `autoUpdateProfiler` and `sampleFrames` enabled will use some CPU cycles each frame... so make sure to disable the profiler when you are done developing/testing.

Here's the updated example, all together:

```
<script type="text/javascript">
/// Define some global values, it looks nicer this way (and is easier to modify later)	
var global = {
	x : 10,
	y : 40,
	radius : 30,
	ballColor : '#f0f',
	canvasColor : '#222',
	canvasHeight : 100,
	canvasWidth : 400
};

// Execute this code when the document loads
$(document).ready(function(){
	$("canvas").each(function(){
		// Initialize "this," which is a canvas as defined by the jQuery selector above
		jck(this,{
			framerate 		: 20,
			autoUpdate 		: true,
			autoClear 		: true
		});
		
		// Use the JCK setHeight() and getHeight() functions to give the dimensions
		// as defined by our "global" variable
		this.setHeight(global.canvasHeight);
		this.setWidth(global.canvasWidth);
		
		// Give the canvas a color so that we know it's there
		$(this).css({'background' : global.canvasColor});
		 
		//  Look at this!  We're overriding the run loop!  This code executes every frame,
		//  which occurs 20 times a second (as specified when we called jck())
		this.runloop = function(){
			// Move the ball's x coordinate up one
			global.x++;
			
			// Do some standard canvas element calls to draw a big purple ball.
			// Don't worry if this block doesn't make any sense yet.
			this.context.beginPath();
			this.context.arc(global.x, global.y, global.radius, 0, Math.PI*2, true);
			this.context.fillStyle = global.ballColor;
			this.context.fill();
			this.context.closePath();
		 };
		
		// This is where we make our updates!  This is the profiler code!
		this.createProfiler();
		this.toggleProfiler();
		this.options.autoUpdateProfiler = true;
		this.options.sampleFrames = true;
	});
});

</script>
```

# Adding custom properties #

Seeing only built-in JCK variables in the profiler is helpful only to a certain extent.  If you are making something of any complexity, you will likely want your own values.  The JCK profiler supports that.  To do this, there are two additional steps.  When you initialize the profiler, you will have to feed it custom values as an array of JSON objects, and then update the profiler every frame in your run loop with that same array.

There is a JCK method called `addProfilerValue()`.  It makes the most sense to call this sometime between calling `jck()` itself and defining the run loop.  It is expecting the array of JSON objects I mentioned a moment ago, and the object model for the JSON is as follows:

```
{	
	label : "whatYouWillSeeAsALabel",
	value : theValueOfWhateverYouWant
}
```

A practical example of calling calling `addProfilerValue()`:

```
this.addProfilerValue([
	{	
		label : "Player health",
		value : health
	},
	{	
		label : "Enemies remaining",
		value : enemiesArray.length
	}
]);
```

... Assuming that `health` and `enemiesArray` are variables in your app.

That's the first step.  Next, we have to call `updateProfiler()` on the canvas.  It takes the same data that we fed `addProfilerValue()`.  You will want to stick this somewhere in your run loop, but in most cases it is best to tack it on somewhere towards the end of the run loop.  In keeping with the previous example, here is how we might call `updateProfiler()` inside the run loop:

```
this.runloop = function(){
	this. updateProfiler([
	{	
		label : "Player health",
		value : health
	},
	{	
		label : "Enemies remaining",
		value : enemiesArray.length
	}]);
};
```

When the profiler is visible, these values will be updated in real time.

# Advanced tip #

The `addProfilerValue()` and `updateProfiler()` redundancy is necessary because the JCK does not otherwise know about your application's values.  If you update one function call's parameters, you need to make sure that the other is updated in sync, or bad things will happen.  What you can do to prevent any inconsistencies is to simply make a function out of the array.  Using our previous example:

```
function profilerValues(){
	return [{	
		label : "Player health",
		value : health
	},
	{	
		label : "Enemies remaining",
		value : enemiesArray.length
	}]
}
```

...and we can use this like so (quick and dirty full example):

```
$('canvas').each(function(){
	jck(this, {
		autoUpdate		: true,
		autoUpdateProfiler	: false,
		sampleFrames		: true,
		showProfiler		: true
	});

	this.addProfilerValue(profilerValues());

	this.runloop(function(){
		this.updateProfiler(profilerValues());
	});
});

function profilerValues(){
	return [{	
		label : "Player health",
		value : health
	},
	{	
		label : "Enemies remaining",
		value : enemiesArray.length
	}]
}
```

Cool!