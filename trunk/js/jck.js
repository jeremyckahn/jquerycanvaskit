/*
	jQuery Canvas Kit
	v. 0.1
	by Jeremy Kahn - jeremyckahn@gmail.com

	jQuery Canvas Kit (JCK) is a jQuery toolkit that extends functionality of the HTML 5 
	canvas tag.  To use it, simply call the jck() function with the canvas element as 
	the parameter.  Since JCK uses jQuery, you may want to initialize it with something 
	like this:
	
	$(document).ready(function(){
		$("canvas").each(function(){
			jck(this);
		});
	});
	
	This fun little snippet will extend the functionality of all of the canvases on the 
	page as soon as the page has loaded.
	
	Further documentation is forthcoming.
*/

function jck(canvas, options){
	
	// If the canvas does does not have an ID, generate one
	if (canvas.id == null)
		canvas.id = random(0, 100000000);
	
	canvas.context = canvas.getContext("2d");
	
	// Give the canvas a JSON object representing things to draw in the drawlist
	canvas.drawlist = {};
	
	// Define some hooks for the development profiler
	canvas.profilerID = canvas.id + "Profiler";
	canvas.additionalProfilerOutputs = new Array();
	
	// Used to give a real-time output of how many frames are actually being rendered
	canvas.frameSampleTimes = new Array();
	
	// Set default options
	
	// The attempted frames processed per second
	if (options.framerate == null)
		options.framerate = 20;
		
	// If true, the canvas will be updated at the rate defined by the framerate option
	if (options.autoUpdate == null)
		options.autoUpdate = true;
		
	/* 	If true, the canvas will be cleared out and before redraw.  You'll usually want this on,
		But performance is affected. */
	if (options.autoClear == null)
		options.autoClear = true;
	
	// If true, the canvas will take up the entire browser window
	if (options.fullscreen == null)
		options.fullscreen = false;
	
	// Controls wether the profiler for this canvas is displayed
	if (options.showProfiler == null)
		options.showProfiler = false;
		
	/*	NOTE:  It is wasteful to have this set to true if updateProfiler() is being called explicitly in your runloop.
		That approach is not as straightforward but does allow you to keep your custom profiler values up-to-date.
		Long story short, either set this to true or update the profiler yourself. Not both.  */
	if (options.autoUpdateProfiler == null)
		options.autoUpdateProfiler = false;
		
	// Used to calculate actual frames being processed.  Off by default because it hurts performance
	if (options.sampleFrames == null)
		options.sampleFrames = false;
		
	// Give the options to the canvas
	canvas.options = options;
		
	// Values defined in this object will be used to give real-time data for canvas performance
	canvas.liveData = {
		actualFPS : "Sampling..."
	};
	
	/* - Setters for width and height.  Must be defined up here because they are used immediately below. - */
	canvas.setHeight = function(newHeight){
		$(this).height(newHeight);
		this.height = (newHeight);
	};
	
	canvas.setWidth = function(newWidth){
		$(this).width(newWidth);
		this.width = (newWidth);
	};
	
	// Call this to set the canvas's dimensions equal to that of the window
	canvas.stretchToFullscreen = function(){
		canvas.setHeight($(window).height());
		canvas.setWidth($(window).width());
	}
	
	/* 	Now that the fullscreen logic has been defined, use it to set the canvas to fullscreen 
		if the option was set at initialization time /**/
	if (canvas.options.fullscreen){
		$(window).resize(function(){
			canvas.stretchToFullscreen();
		});
		
		canvas.stretchToFullscreen();
	}
	
	/* - Getters - */
	canvas.getHeight = function(){
		return this.height;
	};
	
	canvas.getWidth = function(){
		return this.width;
	};
	/* - END Getters - */
	
	/* - Additional canvas functions - */
	canvas.runloop = function(){
		// I'm your run loop!  I don't do anything yet!  Override me!
	};
	
	// Toggle the pause status of the canvas's update loop
	canvas.togglePause = function(){
		this.options.autoUpdate = !this.options.autoUpdate;
	};
		
	/*	Redraw routine for the canvas.  Also acts as a wrapper for canvas.runloop.
		Define your redraw logic with canvas.runloop, overriding this function
		is a bad idea.	*/
	canvas.update = function(){
		
		// If autoUpdate is turned off, just exit out of the function
		if (!canvas.options.autoUpdate)
			return;
		
		/*	If autoClear is enabled, clear out the canvas before redrawing it.
			This is desirable in most applications, but keep in mind that there is an
			impact on performance.  It is enabled by default. */
		if (canvas.options.autoClear)
			canvas.context.clearRect(0, 0, canvas.getWidth(), canvas.getHeight());
		
		/* 	Make sure that the runloop hasn't been overridden with something other than
			a function, and then run it */
		if (typeof canvas.runloop === "function"){
			canvas.runloop();
		}
		
		// Determine the actual number of frames being processed real-time
		if (canvas.options.sampleFrames){
			canvas.frameSampleTimes.push(now().getTime());

			if (canvas.frameSampleTimes.length > canvas.options.framerate){
				canvas.frameSampleTimes.shift();

				// Do some crazy math on the frameSampleTimes values to determine the actual frames being rendered
				canvas.liveData.actualFPS = parseFloat(
					((canvas.options.framerate - 1) * 1000)  / (canvas.frameSampleTimes[canvas.frameSampleTimes.length - 1] - canvas.frameSampleTimes[0])
					).toFixed(3);
			};
		}
		
		if (canvas.options.autoUpdateProfiler)
			canvas.updateProfiler();
	};
	
	// Now that the update function has been defined, repeat it at the rate defined by canvas.options.framerate
	canvas.updateHandle = setInterval(canvas.update, parseInt(1000 / canvas.options.framerate));
	
	/* - END Additional cnavas functions - */
	
	/* - Profiler functions - 
	
		The profiler is used to give real-time output for various things as a draggable overlay.  By default, it outputs
		all of the options and liveData for the canvas, but can be extended with custom values. Since updating it every frame
		affects performance, you need to explicitly call updateProfiler() in your canvas.runloop override to keep it real-time.  
		
		Alternatively, you can set options.autoUpdateProfiler to true and have it update the jck values only.  This approach
		does not allow for custom live-updated values, however.  */
	canvas.createProfiler = function(){
		info = "";
			
		for(var option in this.options)
			info += makeProfilerLI(canvas, option, this.options[option]);
			
		for(var data in this.liveData)
			info += makeProfilerLI(canvas, data, this.liveData[data]);
		
		$("body").append(makeProfilerUL(canvas, info));
		
		$("#" + canvas.profilerID).each(function(){
			$(this).addClass("profilerOutput").draggable().css({"display" : "block"});
		});
	}
	
	// Completely remove the profiler from the document
	canvas.killProfiler = function(){
		$("#" + canvas.profilerID).remove();
	}
	
	canvas.showProfiler = function(){
		$("#" + canvas.profilerID).css({"display" : "block"});
	}
	
	canvas.hideProfiler = function(){
		$("#" + canvas.profilerID).css({"display" : "none"});
	}
	
	// Shows/hides the profiler, but keeps it in the document
	canvas.toggleProfiler = function(){
		canvas.options.showProfiler = !canvas.options.showProfiler;
		$("#" + canvas.profilerID).toggle("fast");
	};

	/*	Define any custom user-variables to be included in the profiler.  The values must be added before 
		they can be displayed in the output.  Values must be given as an array with the following JSON format:
	
		[
			{	
				label : "label for value one",
				value : "initial value for value one"
			},
			{	
				label : "label for value two",
				value : "initial value for value two"
			}
		]
		
		etc, etc.  That would be a valid argument for this function.
		
		NOTE:  Calling this function wipes out all values added previously, so you must add them again if you wish
		to hang onto them.  All needed values must be added in the parameter array at once.
	
	*/
	canvas.addProfilerValue = function(profilerValues){ // Expecting an array
		// Blank out the profiler and start fresh with it before we add the new values
		canvas.killProfiler();
		canvas.createProfiler();
	
		for (var i = 0; i < profilerValues.length; i++)
			canvas.additionalProfilerOutputs.push(profilerValues[i]);
			
		for (var i = 0; i < canvas.additionalProfilerOutputs.length; i++)
			$(makeProfilerLI(canvas, canvas.additionalProfilerOutputs[i].label, canvas.additionalProfilerOutputs[i].value)).appendTo("#" + canvas.profilerID);
			
	};
	
	/*	If you are calling this explicitly and are passing custom values, you must pass them as the parameters here as well.
		Use the same format used when adding them initially, as detailed above.  */
	canvas.updateProfiler = function(additionalValues){ // Expecting an array
		for (var data in this.liveData)
			$("#" + canvas.profilerID + " #" + getProfilerLIID(canvas, data, this.liveData[data]) + " .value").html(this.liveData[data]);
		
		if (additionalValues != null){
			for (var i = 0; i < additionalValues.length; i++)
				$("#" + canvas.profilerID + " #" + getProfilerLIID(canvas, additionalValues[i].label) + " .value").html(additionalValues[i].value);
		}
	}
	/* - END Profiler functions - */
	
	return canvas;
}

/* Used for the profiler functions, but can be used statically */
function makeProfilerUL(canvas, text){
	return "<ul id=\"" + canvas.profilerID + "\">" + text + "</ul>";
}

function makeProfilerLI(canvas, label, value){
	return "<li id=\"" + getProfilerLIID(canvas, label) + "\"><span class=\"label\">" + label + ":</span>" + "<span class=\"value\">" + value + "</span></li>";
}

function getProfilerLIID(canvas, label){
	return canvas.profilerID + label;
}

// Get the current time
function now(){
	return new Date();	
}

// Useful for getting random integer values.  Parameters are optional
function random(max, min){
	if (max == null && min == null)
		return Math.random();
	
	if (min == null)
		return Math.floor(Math.random() * max);
		
	difference = max - min;
	return min + Math.floor(Math.random() * difference);
};