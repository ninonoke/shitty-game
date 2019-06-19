var obstacleArr = [
	{ name: "and", width: 79, height: 64 },
	{ name: "poop", width: 63, height: 67 },
	{ name: "four", width: 61, height: 64 },
	{ name: "three", width: 48, height: 82 },
	{ name: "banana-bark", width: 72, height: 61 },
	{ name: "l", width: 55, height: 62 },
	{ name: "o-1", width: 43, height: 45 },
	{ name: "o-1", width: 43, height: 45 },
	{ name: "s", width: 49, height: 81 },
	{ name: "e", width: 53, height: 46 },
	{ name: "r", width: 55, height: 53 },
	{ name: "dot", width: 31, height: 43 },
	{ name: "Exclamation-mark", width: 64, height: 60 },
	{ name: "check", width: 58, height: 100 },
	{ name: "heart", width: 59, height: 59 },
	{ name: "double-dot", width: 45, height: 81 },
	{ name: "zero", width: 42, height: 99 },
	{ name: "question-mark", width: 52, height: 82 },
	{ name: "minus", width: 46, height: 68 },
	{ name: "check-list", width: 55, height: 96 },
	{ name: "boubble", width: 66, height: 74 },
	{ name: "one", width: 47, height: 80 },
];

var obstacleCount = obstacleArr.length;

var image = document.getElementById("source");

var canvasWidth = window.innerWidth > 1024
									? window.innerWidth
									: 1024;

minHeight = 20;
maxHeight = 100;
minWidth  = 10;
maxWidth  = 10;
minGap    = 350;
maxGap    = 600;
gap       = randGap();

var myObstacles = [];

function startGame() {
	gamearea.start();
}

function everyinterval(n) {

	if (gamearea.frame % n === 0) {
		return true;
	}

	return false;
}

function jump() {
	if (player.speedY === 0) {
		player.speedY = -2;
	}
}

function randGap() {
	return Math.floor(minGap + Math.random() * (maxGap - minGap + 1));
}

var player = {
	x:      20,
	y:      470,
	speedY: 0,

	update: function() {

		var proportion = image.height / image.width;

		var imageWidth  = 30;
		var imageHeight = 30 * proportion;

		gamearea.context.drawImage(image, this.x, this.y - imageHeight + 30, imageWidth, imageHeight);
	},

	newPos: function() {

		if (this.y < 250) {
			this.speedY = 2;
		}

		this.y = this.y + this.speedY;

		if (this.speedY === 2 && this.y === 470) {
			this.speedY = 0;
		}
	},

	crashWith: function(obs) {

		if (this.x + 30 > obs.x && this.x < obs.x + obs.width && this.y + 30 > obs.y) {
			return true;
		}

		return false;
	}
};


function Obstacle(data) {

	var img = document.createElement("img");

	img.src = "assets/images/obstacles/" + data.name + ".png";

	this.height = data.height;
	this.width  = data.width <= 72
								? data.width
								: 72;
	this.x      = canvasWidth;
	this.y      = gamearea.canvas.height - this.height;
	this.draw   = function() {
		gamearea.context.drawImage(img, this.x, this.y, this.width, this.height);
	};
}

var gamearea = {

	canvas: document.createElement("canvas"),

	start: function() {
		this.canvas.height = 500;
		this.canvas.width  = canvasWidth;

		document.body.insertBefore(this.canvas, document.body.childNodes[0]);
		this.context  = this.canvas.getContext("2d");
		this.frame    = 0;
		this.interval = setInterval(this.updateGameArea, 5);

		// jumps
		window.addEventListener("keydown", jump);
		window.addEventListener("mousedown", jump);
	},

	updateGameArea: function() {

		for (let i = 0; i < myObstacles.length; i++) {

			if (player.crashWith(myObstacles[i])) {
				gamearea.stop();

				return;
			}
		}

		gamearea.clear();

		if (everyinterval(gap)) {

			var index = obstacleCount % obstacleArr.length;

			myObstacles.push(new Obstacle(obstacleArr[index]));
			gap            = randGap();
			gamearea.frame = 0;

			obstacleCount++;
		}

		for (let i = 0; i < myObstacles.length; i++) {
			myObstacles[i].x -= 1;
			myObstacles[i].draw();
		}

		player.newPos();
		player.update();

		gamearea.frame += 1;
	},

	clear: function() {
		gamearea.context.clearRect(0, 0, this.canvas.width, this.canvas.width);
	},

	stop: function() {
		clearInterval(this.interval);

		if (confirm("Have you already found your self-esteem or continue your journey?")) {

			document.body.removeChild(this.canvas);

			myObstacles = [];

			startGame();
		}
	}
};