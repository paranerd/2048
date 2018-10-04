/**
 * NOTE
 * By default, 2|2|4 becomes 4|4|0 on a left shift, so there's one single shift
 * to have it become 8|0|0 (a double shift)
 * just remove the last condition in the else if in the movement functions
 **/

(function() {
	'use strict';

    window.onload = function() {
        console.log("Loaded 3");

        test();
     }

    function test() {
         console.log("test worx 2");
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker
        .register('./service-worker.js')
        .then(function() { console.log('Service Worker Registered'); });
    }
})();

var starttime = 59,
	tiles = [],
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

	tiles = [];
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

	// Draw grid and initialize tiles array
	for (var i = 0; i < gridsize; i++) {
		var row = document.createElement('div');
		row.className = 'row';
		playground.appendChild(row);
		var newLine = [];
		tiles.push(newLine);
		for (var j = 0; j < gridsize; j++) {
			var tile = document.createElement('div');
			tile.id = i + "" + j;
			tile.className = "tile";
			row.appendChild(tile);
			tiles[i].push({value: 0, changed: false});
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
			if (j > 0 && tiles[i][j].value != 0 && (tiles[i][j-1].value == tiles[i][j].value || tiles[i][j-1].value == 0) && !tiles[i][j-1].changed) {
				// Check if we move to 0-tile
				var toZeroTile = tiles[i][j-1].value == 0;

				// Add values
				tiles[i][j-1].value += tiles[i][j].value;

				// Tile moves, so leaves a 0-tile
				tiles[i][j].value = 0;

				// Mark tile as changed if it wasn't 0 before
				tiles[i][j-1].changed = !toZeroTile;

				// Board changed (we expect a new tile)
				changed = true;

				// Change score
				score += tiles[i][j-1].value;

				// If we moved to a 0-tile, we need to check that again
				j = (toZeroTile) ? j - 2 : j;
			}
		}
	}

	writeGrid();
	next(false);
}

function moveright() {
	for (var i = gridsize - 1; i >= 0; i--) {
		for (var j = gridsize - 1; j >= 0; j--) {
			if (j < gridsize - 1 && tiles[i][j].value != 0 && (tiles[i][j+1].value == tiles[i][j].value || tiles[i][j+1].value == 0) && !tiles[i][j+1].changed) {
				// Check if we move to 0-tile
				var toZeroTile = tiles[i][j+1].value == 0;

				// Add values
				tiles[i][j+1].value += tiles[i][j].value;

				// Tile moves, so leaves a 0-tile
				tiles[i][j].value = 0;

				// Mark tile as changed if it wasn't 0 before
				tiles[i][j+1].changed = !toZeroTile;

				// Board changed (we expect a new tile)
				changed = true;

				// Change score
				score += tiles[i][j+1].value;

				// If we moved to a 0-tile, we need to check that again
				j = (toZeroTile) ? j + 2 : j;
			}
		}
	}

	writeGrid();
	next(false);
}

function movedown() {
	for (var j = gridsize - 1; j >= 0; j--) {
		for (var i = gridsize - 1; i >= 0; i--) {
			if (i < gridsize - 1 && tiles[i][j].value != 0 && (tiles[i+1][j].value == tiles[i][j].value || tiles[i+1][j].value == 0) && !tiles[i+1][j].changed) {
				// Check if we move to 0-tile
				var toZeroTile = tiles[i+1][j].value == 0;

				// Add values
				tiles[i+1][j].value += tiles[i][j].value;

				// Tile moves, so leaves a 0-tile
				tiles[i][j].value = 0;

				// Mark tile as changed if it wasn't 0 before
				tiles[i+1][j].changed = !toZeroTile;

				// Board changed (we expect a new tile)
				changed = true;

				// Change score
				score += tiles[i+1][j].value;

				// If we moved to a 0-tile, we need to check that again
				i = (toZeroTile) ? i + 2 : i;
			}
		}
	}

	writeGrid();
	next(false);
}

function moveup() {
	for (var j = 0; j < gridsize; j++) {
		for (var i = 1; i < gridsize; i++) {
			if (i > 0 && tiles[i][j].value != 0 && (tiles[i][j].value == tiles[i-1][j].value || tiles[i-1][j].value == 0) && !tiles[i-1][j].changed) {
				// Check if we move to 0-tile
				var toZeroTile = tiles[i-1][j].value == 0;

				// Add values
				tiles[i-1][j].value += tiles[i][j].value;

				// Tile moves, so leaves a 0-tile
				tiles[i][j].value = 0;

				// Mark tile as changed if it wasn't 0 before
				tiles[i-1][j].changed = !toZeroTile;

				// Board changed (we expect a new tile)
				changed = true;

				// Change score
				score += tiles[i-1][j].value;

				// If we moved to a 0-tile, we need to check that again
				i = (toZeroTile) ? i - 2 : i;
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
			tile.innerHTML = (tiles[i][j].value != 0) ? tiles[i][j].value : "";
			removeClassByPrefix(tile, "tile-");
			tile.classList.add('tile-' + tiles[i][j].value);
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
			if (tiles[i][j].value == 0) {
				var newEmpty = [i, j];
				empty.push(newEmpty);
			}
		}
	}

	if (empty.length != 0 && (changed || initializing)) {
		var newRandom = Math.floor(Math.random() * empty.length);
		var i = empty[newRandom][0];
		var j = empty[newRandom][1];
		if (Math.floor(Math.random() * 100) < 85) {
			tiles[empty[newRandom][0]][empty[newRandom][1]].value = 2;
		}
		else {
			tiles[empty[newRandom][0]][empty[newRandom][1]].value = 4;
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
			tiles[i][j].changed = false;
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
				if (tiles[i] && tiles[i][j-1] && tiles[i][j-1].value == tiles[i][j].value ||
					tiles[i] && tiles[i][j+1] && tiles[i][j+1].value == tiles[i][j].value ||
					tiles[i-1] && tiles[i-1][j] && tiles[i-1][j].value == tiles[i][j].value ||
					tiles[i+1] && tiles[i+1][j] && tiles[i+1][j].value == tiles[i][j].value
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
