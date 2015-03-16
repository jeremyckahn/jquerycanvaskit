# Overview #

  * jQuery plugin architecture
  * New run loop engine
  * APIs
  * Development tools

## jQuery plugin architecture ##

Follow this guide: http://docs.jquery.com/Plugins/Authoring

## New run loop engine ##

**The big idea:**  The original version of the JCK's run loop was driven by setInterval().  This is bad.  If the draw cycles become too busy, the frames stack up uncontrollably and, even if the update function is quit out of, this is still sloppy.  A self-calling setTimeout() should be used.  Not only that, but draw coordinates are statically governed in the original version - they should be calculated based on real time.  The JCK APIs, described below, should calculate this.  Since animation will be based on jQuery.animate(), the new run loop will examine all objects' current state and then handle the rendering for whatever the current frame and state is.

## APIs ##

There will be several APIs associated with the JCK.  They are as such:

  * Display API
  * Shapes API
  * Animation API
  * Text API
  * Events API
  * Canvas Manager API

## Display API ##

The Display API will manage all aspects of how something is displayed.  To work with the Display API, an object must implement a **jckDisplayable** interface.  The Display API will handle all aspects of displaying something on a canvas, such as:

  * Position
  * Size
  * Scale
  * Color
  * Opacity
  * Transform (rotation)

These all have get/set accessors.  A jckDisplayable object must also implement the following events:

  * onBeforeCreated - Just before an element is created
  * onAfterCreated - Just after an element is created
  * onBeforeDestroyed  - Just before an element is destroyed
  * onAfterDestroyed  - Just after an element is destroyed

## Shapes API ##

An API for describing how a shape looks.  All of the objects in the Shapes API will inherit from **jckShape**.  Users will also be free to create their own shapes that inherit from jckShape.  Predefined shapes are:

  * jckShape.circle
  * jckShape.rect
  * jckShape.poly
  * jckShape.bezier

There **must** be support for SVGs as well, but that will come later as they are significantly more complicated than primitive shapes.

## Animation API ##

An API for describing the movement of a jckShape.  However, any object can be implement the jckAnimate API, so long as it implements the **jckAnimateable** interface.  Serves as a wrapper for jquery.animate().  There will be several ways to animate a jckAnimateable.  Primary methods for animation:

  * jckAnimateable.moveTo() - Move to a specified coordinate
  * jckAnimateable.moveBy() - Move in a specified direction by a specified speed

A jckAnimateable must implement the following events:

  * onCollide - Collision detection
  * onBeforeMoved - Fired every frame before an object is moved
  * onAfterMoved - Fired every frame after an object is moved

## Text API ##

The HTML 5 canvas has APIs for text, so will JCK.  Will implement the jckAnimateable interface.  Base class is the **jckText** object.

## Canvas Manager API ##

This API will manage the display and general properties of the canvas element itself.  This includes height and width, resizing and contexts.  It will also handle full screen mode.

## Development tools ##

A performance profiler much like the one from the original JCK will be implemented.  However, the API will be easier to use and the profiler itself will be faster (the display elements will be cached).  There will also be logging tools.