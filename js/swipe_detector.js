var Swipe = new function() {
	var self = this;
	this.start = {x: null, y: null};
	this.callbacks = {up: null, right: null, down: null, left: null};

	this.init = function() {
		document.addEventListener('touchstart', function(e) {
			var touch = e.touches[0] || e.changedTouches[0];
			self.start.x = touch.pageX;
			self.start.y = touch.pageY;
		});

		document.addEventListener('touchend', function(e) {
			var touch = e.touches[0] || e.changedTouches[0];

			self.process({x: touch.pageX, y:touch.pageY});
		});
	}

	this.process = function(end) {
		var diffX = Math.abs(self.start.x - end.x);
		var diffY = Math.abs(self.start.y - end.y);

		if (diffX >= diffY) {
			if (self.start.x < end.x) {
				if (self.callbacks.right) {
					self.callbacks.right();
				}
			}
			if (self.start.x > end.x) {
				if (self.callbacks.left) {
					self.callbacks.left();
				}
			}
		}
		else {
			if (self.start.y > end.y) {
				if (self.callbacks.up) {
					self.callbacks.up();
				}
			}
			else if (self.start.y < end.y) {
				if (self.callbacks.down) {
					self.callbacks.down();
				}
			}
		}
	}

	this.onUp = function(callback) {
		self.callbacks.up = callback;
	}

	this.onRight = function(callback) {
		self.callbacks.right = callback;
	}

	this.onDown = function(callback) {
		self.callbacks.down = callback;
	}

	this.onLeft = function(callback) {
		self.callbacks.left = callback;
	}
}
