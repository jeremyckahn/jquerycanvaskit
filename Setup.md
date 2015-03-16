# Required files #

The jQuery Canvas Kit is very easy implement.  To start, you need to include the requisite libraries:

  * Query 1.4.2 or above
  * QueryUI 1.8 or above

...and all files associated with those.  Please see the jQuery site (www.jquery.com) for information regarding those libraries.  These libraries are distributed in the .ZIP packages for each JCK release for convenience.

Once you have included these files in your document, you will need to include jckstyle.css and jck.js.

# Initialization #

To extend a canvas with the JCK functionality you need to call this function:

```
jck(canvasElement [options]);
```

I'll explain the options in a moment.

The "canvasElement" is a reference to an HTML 5 canvas element, however you created it.  A handy way to to JCK-ify all of the canvases on the document at once  is with this jQuery snippet:

```
$(document).ready(function(){
    $("canvas").each(function(){
         jck(this);
    });
});
```

When the document loads, jQuery will traverse the entire DOM and pass each canvas element through the jck() function.

# Optional parameters #

There are a number of options that can either be set upon initialization or afterwards.  To set the options (explained momentarily), use this syntax:

```
jck(this,
    {
	[options.option1 : value1,]
	[options.option2 : value2,]
        ...
    });
```

And so on.

The options are as follows:
  * **options.framerate** (Integer, default: 20) This is the speed (measured in frames per second) at which your application will run.  It is recommended to stay within 12 to 30 frames per second.
  * **options.autoUpdate** (Boolean, default: true) If true, the canvas will update automatically at the speed defined by options.framerate.
  * **options.autoClear** (Boolean, default: true) If true, the canvas will be cleared out and and start fresh upon update.  This is desirable in most situations, although there is a performance cost.
  * **options.fullscreen** (Boolean, default: false) If true, the canvas will take up the entire browser window.
  * **options.showProfiler** (Boolean, default: false) Determines whether to show the performance profiler when the canvas is initialized.  Generally not recommended for production use.
  * **options.autoUpdateProfiler** (Boolean, default: false) If true, the profiler updating calls will be handled for you.  This is easier, but custom profiler values will not work properly when set to true (the real-time framerate monitor will still work just fine).  Additionally, updating the profiler takes some CPU cycles, so you will want this set to false when your app is ready for production use.
  * **options.sampleFrames** (Boolean, default: false) This needs to be set to true in order for the framerate monitor to work.  Off by default because there is a performance cost.  Make sure to set it to false when your app is done.

Changing most of these options after the initialization time won't have an effect.  This is going to be addressed in a future revision.

# Defining height and width #

One thing you may want to do right off the bat with your canvas is specify a height and width.  You could certainly modify the standard `height` and `width` canvas properties, but the problem with that is that DOM `height` and `width` canvas properties do not correlate to the CSS `height` and `width` values.  To change all of the appropriate values simultaneously and keep everything in sync, use `canvas.getHeight()` and `canvas.setHeight()` to modify/evaluate the canvas's height, and `canvas.getWidth()` and `canvas.setWidth()` for the width.

# Now what? #

You're probably going to want to do something with your newly kitted canvas.  A good next step is understanding and defining your [run loop](Run_loop.md).