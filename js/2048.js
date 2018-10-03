/**
 * NOTE
 * By default, 2|2|4 becomes 4|4|0 on a left shift, so there's one single shift
 * to have it become 8|0|0 (a double shift)
 * just remove the last condition in the else if in the movement functions
 **/

var starttime = 59,
	occupied = [],
	gridsize =  4,
	changed = false,
	score = 0,
	highscore = 0;

window.onload = function() {
	init();
}

function init() {
	// Clear
	var playground = document.getElementById('playground');
	while (playground.firstChild) playground.removeChild(playground.firstChild);

	occupied = [];
	score = 0;
	Swipe.init();
	Swipe.onLeft(moveleft);
	Swipe.onUp(moveup);
	Swipe.onRight(moveright);
	Swipe.onDown(movedown);

	playground.style.width = gridsize * 100 + gridsize * 4 + "px";
	playground.style.height = gridsize * 100 + gridsize * 4 + "px";
	playground.style.top = (window.innerHeight - parseInt(playground.style.height)) / 2 + "px";
	playground.style.left = (window.innerWidth - parseInt(playground.style.width)) / 2 + "px";

	scorediv.style.width = gridsize * 100 + gridsize * 4 + "px";
	scorediv.style.marginLeft = (window.innerWidth - parseInt(playground.style.width)) / 2 + "px";

	// Draw grid and initialize occupied array
	for (var i = 0; i < gridsize; i++) {
		var row = document.createElement('div');
		row.className = 'row';
		playground.appendChild(row);
		var newLine = [];
		occupied.push(newLine);
		for (var j = 0; j < gridsize; j++) {
			var tile = document.createElement('div');
			tile.id = i + "" + j;
			tile.className = "tile";
			row.appendChild(tile);
			occupied[i].push({value: 0, changed: false});
		}
	}

	next(true);
	next(true);
	starttime = Date.now();
}

document.onkeydown = function(e) {
	switch(e.keyCode) {
		case 37: // left
			moveleft();
			break;
		case 38: // up
			moveup();
			break;
		case 39: // right
			moveright();
			break;
		case 40: // down
			movedown();
			break;
		default:
			break;
	}
}

function moveleft() {
	for (var i = 0; i < gridsize; i++) {
		for (var j = 0; j < gridsize; j++) {
			if (occupied[i][j].value != 0) {
				if (j > 0 && occupied[i][j-1].value == 0) {
					occupied[i][j-1].value = occupied[i][j].value;
					occupied[i][j].value = 0;
					j -= 2;
					changed = true;
				}
				else if (j > 0 && occupied[i][j-1].value == occupied[i][j].value && !occupied[i][j-1].changed) {
					occupied[i][j-1].value = occupied[i][j].value * 2;
					score += occupied[i][j-1].value;

					occupied[i][j].value = 0;
					occupied[i][j-1].changed = true;
					j -= 1;
					changed = true;
				}
			}
		}
	}

	writeGrid();
	next(false);
}

function moveright() {
	for (var i = gridsize - 1; i >= 0; i--) {
		for (var j = gridsize - 1; j >= 0; j--) {
			if (occupied[i][j].value != 0) {
				if (j < gridsize - 1 && occupied[i][j+1].value == 0) {
					occupied[i][j+1].value = occupied[i][j].value;
					occupied[i][j].value = 0;
					j += 2;
					changed = true;
				}
				else if (j < gridsize - 1 && occupied[i][j+1].value == occupied[i][j].value && !occupied[i][j+1].changed) {
					occupied[i][j+1].value = occupied[i][j].value * 2;
					score += occupied[i][j+1].value;

					occupied[i][j].value = 0;
					occupied[i][j+1].changed = true;
					j += 1;
					changed = true;
				}
			}
		}
	}

	writeGrid();
	next(false);
}

function movedown() {
	for (var j = gridsize - 1; j >= 0; j--) {
		for (var i = gridsize - 1; i >= 0; i--) {
			if (occupied[i][j].value != 0) {
				if (i < gridsize - 1 && occupied[i+1][j].value == 0) {
					occupied[i+1][j].value = occupied[i][j].value;
					occupied[i][j].value = 0;
					i += 2;
					changed = true;
				}
				else if (i < gridsize - 1 && occupied[i+1][j].value == occupied[i][j].value && !occupied[i+1][j].changed) {
					occupied[i+1][j].value = occupied[i][j].value * 2;
					score += occupied[i+1][j].value;

					occupied[i][j].value = 0;
					occupied[i+1][j].changed = true;
					i += 1;
					changed = true;
				}
			}
		}
	}

	writeGrid();
	next(false);
}

function moveup() {
	for (var j = 0; j < gridsize; j++) {
		for (var i = 0; i < gridsize; i++) {
			if (occupied[i][j].value != 0) {
				if (i > 0 && occupied[i-1][j].value == 0) {
					occupied[i-1][j].value = occupied[i][j].value;
					occupied[i][j].value = 0;
					i -= 2;
					changed = true;
				}
				else if (i > 0 && occupied[i-1][j].value == occupied[i][j].value && !occupied[i-1][j].changed) {
					occupied[i-1][j].value = occupied[i][j].value * 2;
					score += occupied[i-1][j].value;

					occupied[i][j].value = 0;
					occupied[i-1][j].changed = true;
					i -= 1;
					changed = true;
				}
			}
		}
	}

	writeGrid();
	next(false);
}

function writeGrid() {
	for (var i = 0; i < gridsize; i++) {
		for (var j = 0; j < gridsize; j++) {
			var tile = document.getElementById(i + "" + j);
			tile.innerHTML = (occupied[i][j].value != 0) ? occupied[i][j].value : "";
			removeClassByPrefix(tile, "tile-");
			tile.classList.add('tile-' + occupied[i][j].value);
		}
	}

	scorediv.innerHTML = score;
}

function removeClassByPrefix(el, prefix) {
	var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
	el.className = el.className.replace(regx, '');
	return el;
}

function next(initializing) {
	// Gather all empty fields
	var empty = [];
	for (var i = 0; i < gridsize; i++) {
		for (var j = 0; j < gridsize; j++) {
			if (occupied[i][j].value == 0) {
				var newEmpty = [i, j];
				empty.push(newEmpty);
			}
		}
	}

	if (empty.length != 0 && (changed || initializing)) {
		var newRandom = Math.floor(Math.random()*empty.length);
		var i = empty[newRandom][0];
		var j = empty[newRandom][1];
		if (Math.floor(Math.random() * 100) < 85) {
			occupied[empty[newRandom][0]][empty[newRandom][1]].value = 2;
		}
		else {
			occupied[empty[newRandom][0]][empty[newRandom][1]].value = 4;
		}

		transition(i + "" + j, 500);

		writeGrid();
		if (empty.length <= 1) {
			checkGameover();
		}
	}

	// Remove "changed" flag
	for (var i = 0; i < gridsize; i++) {
		for (var j = 0; j < gridsize; j++) {
			occupied[i][j].changed = false;
		}
	}

	changed = false;
}

function transition(id, time) {
	var node = document.getElementById(id);
	node.style.opacity = 0;
	fadeIn(node, 500);
}

function fadeIn(node, time) {
	var diff = (time > 0) ? (100 / time) : 1;
	var op = (node.style.opacity) ? parseInt(node.style.opacity) : 0;

	if (time == 0) {
		node.style.opacity = 1;
		return;
	}

	var interval = setInterval(function() {
		op += diff;
		node.style.opacity = op;

		if (node.style.opacity >= 1) {
			clearTimeout(interval);
		}
	}, 100);
}

function checkGameover() {
		for (var i = 0; i < gridsize; i++) {
			for (var j = 0; j < gridsize; j++) {
				if (occupied[i] && occupied[i][j-1] && occupied[i][j-1].value == occupied[i][j].value ||
					occupied[i] && occupied[i][j+1] && occupied[i][j+1].value == occupied[i][j].value ||
					occupied[i-1] && occupied[i-1][j] && occupied[i-1][j].value == occupied[i][j].value ||
					occupied[i+1] && occupied[i+1][j] && occupied[i+1][j].value == occupied[i][j].value
				) {
					return;
				}
			}
		}

		if (score > highscore) {
			highscore = score;
		}

		if (confirm("Final score: " + score + " Try again?")) {
			init();
		}
}
