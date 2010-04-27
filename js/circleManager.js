function circleManager(canvasManagerObj, x, y, radius, color){
	this.x = x;
	this.y = y;
	this.radius = radius;

	if (!color)
		this.color = "#ddd";
	else
		this.color = color;
	
	_canvasManager = canvasManagerObj;
	_context = _canvasManager.getContext("2d");
}

circleManager.prototype.draw = function(){
//	_context.moveTo(this.x, this.y);
	_context.beginPath();
	_context.arc(this.x, this.y, this.radius, 0, Math.PI*2, true);
	_context.fillStyle = this.color;
	_context.fill();
	_context.closePath();
}