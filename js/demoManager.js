var theCanvas;
var frameCount = 0;
var randCircSizeMin = 10;
var randCircSizeMax = 50;
var goCrazy = false;

$(document).ready(function(){
	/* 	INITIALIZATION AREA - BEGIN
	*	Canvas setup and run loop are defined here.
	*/
	$("#theCanvas").each(function(){
		// Keep a handle on the canvas
		theCanvas = this;
		
		jck(this,
		{
			fullscreen : true,
			framerate :  20,
			autoUpdate : true,
			autoClear : true,
			sampleFrames : true,
			autoUpdateProfiler : false
		});
		
		this.drawlist.circleArray = new Array();
		
		this.createProfiler();
		
		/* 	Add the values to be shown in the profiler.  These must be explicitly passed 
			to the updateProfiler() function each frame to be kept up to date. */ 
		this.addProfilerValue([
			{	
				label : "frameCount",
				value : frameCount
			},
			{	
				label : "circles",
				value : this.drawlist.circleArray.length
			}
		]);
		
		// Define the run loop.  It already exists, but override it to draw stuff
		this.runloop = function(){
			
			/*	If autoClear is enabled, draw the whole array each frame.
				If not, only draw the last one so we don't waste cycles */
			if (this.options.autoClear){
				for (var i = 0; i < this.drawlist.circleArray.length; i++){
					this.drawlist.circleArray[i].draw();
				}
			}
			else{
				if (this.drawlist.circleArray.length > 0)
					this.drawlist.circleArray[this.drawlist.circleArray.length - 1].draw();
			}
			
			// If in crazy mode, add a cirle every frame.  Watch out!  It's pretty crazy!
			if (goCrazy)
				addARandomCircle();
			
			frameCount++;
			
			// Feed the live values back into the canvas's profiler so they can be output
			this.updateProfiler([
				{	
					label : "frameCount",
					value : frameCount
				},
				{	
					label : "circles",
					value : this.drawlist.circleArray.length
				}
			]);
		};	
	});
	
	/* 	INITIALIZATION AREA - END */
	
	/* Set click events to the buttons - BEGIN */
	$("#btnProfiler").click(function(){
		theCanvas.toggleProfiler();
	});	
	
	// Add a circle
	$("#btnMakeCircle").click(function(){
		addARandomCircle();
	});
	
	// Toggle crazy mode
	$("#btnCrazy").click(function(){
		goCrazy  = !goCrazy;
		$(this).html(goCrazy ? "Stop going crazy!" : "Go crazy!");
	});
	
	$("#btnPause").click(function(){
		theCanvas.togglePause();
		$(this).html(theCanvas.options.autoUpdate ? "Pause" : "Unpause"); 
	});
	/* Set click events to the buttons - END */
});

function addARandomCircle(){
	theCanvas.drawlist.circleArray.push(new circleManager(
		theCanvas, 
		Math.floor(Math.random() * theCanvas.getWidth()), // x
		Math.floor(Math.random() * theCanvas.getHeight()), // y
		random(randCircSizeMin, randCircSizeMax), // radius
		"rgb(" + random(255) + ", " + random(255) + ", " + random(255) + ")"
	));
}