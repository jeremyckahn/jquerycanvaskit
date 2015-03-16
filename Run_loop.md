# What's a run loop? #

A run loop is term that is often used in video game development.  Games typically run in a loop, and the screen is redrawn continuously.  The jQuery Canvas Kit makes makes this design pattern the core of its functionality.  This also has several other names, such as draw loop, run cycle, and so on.

# How to use it #

Firstly, there's a few paramenters you will need to have to set in order to utilize the run loop.  Specfically, they are:

```
options.framerate // some integer value
options.autoUpdate // boolean, set to true
```

Although not required, in most cases you will also want

```
options.autoClear  // boolean, set to true
```

Sounds tricky?  Don't worry, they're set by default!  So, for the sake of clarity, you could use this snippet to initialize all of the canvases on the page with the proper options:

```
$(document).ready(function(){
    $("canvas").each(function(){
         jck(this,{
	     framerate 		: 20,
	     autoUpdate         : true,
	     autoClear 		: true
         });
    });
});
```

So now our canvas is redrawing and clearing out at 20 frames a second.  And that's good!

# How do I make my run loop do stuff? #

There's a special function called `canvas.runloop()`.  It doesn't actually do anything by default, it's meant to be overridden and is called every frame by `canvas.update()`.  So, if we have a ball move one pixel to the right every frame, we would define that behavior here.  Here's a very simple script that will do that very thing:

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

This script will create a black canvas, and a ball that will slowly move to the right until it is out of the frame entirely.  You can just plug this in to your HTML code and it will automagically work, assuming everything was set up correctly (please see the [Setup](Setup.md) for more information about that).