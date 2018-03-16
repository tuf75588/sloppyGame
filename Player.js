/* PLAYER SCRIPTS */
const directions = {
	37: {x: -1, y: 0},
	38: {x: 0, y: -1},
	39: {x: 1, y: 0},
	40: {x: 0, y: 1}
}

const maxJuice = 1000;
const dashJuice = 200;


const pause = (function() {
	let timeout;

	return function(callback, time) {
		clearTimeout(timeout);
		timeout = setTimeout(callback, time);
	}
})();


//the soul
const player = {
	x: 100,
	y: 100,
	dx: 0,
	dy: 0,
	width: 10,
	height: 10,
	speed: 2,
	score: 0,
	juice: maxJuice,
	vincible: true,
	powerUp: function(type) {
		const scoreBefore = this.score;

		if(type === "speed up") {
			this.speed += 0.25;
		}

		if(type === "embiggen") {
			this.width += 4;
			this.height += 4;
			this.x -= 2;
			this.y -= 2;
		}

		if(type === "invincibility") {
			this.vincible = false;
			$player.css({backgroundColor: "red"});
			pause(() => this.mortalize(), 5000);

			guys.forEach(guy => {
				guy.attraction = -1;
			})
		}

		if(type === "replenish") {
			this.juice = maxJuice;
		}

		this.score += powerUpScores[type];

		const diff = Math.floor(this.score / 2000) - Math.floor(scoreBefore / 2000);

		for(let i = 0; i < diff; i++) {
			guys.add(spawnGuy());
		}

		scoreUpdate();
	},
	mortalize: function() {
		this.vincible = true;
		$player.css({backgroundColor: "#fff"});
		console.log("ur mortal :<");

		guys.forEach(guy => {
			guy.attraction = 1;
		})
	},
	move: function(dx, dy) {
		const newDx = this.dx + this.speed * dx / 5;
		const newDy = this.dy + this.speed * dy / 5;

		const newX = this.x + newDx;
		const newY = this.y + newDy;

		this.x = Math.min(Math.max(0, newX), width - this.width);
		this.y = Math.min(Math.max(0, newY), height - this.height);

		$player.css({
			left: this.x,
			top: this.y,
			width: this.width,
			height: this.height
		});

		this.dx = newDx / 1.2;
		this.dy = newDy / 1.2;
	},
	dash: function(x, y) {
		if(this.juice >= dashJuice) {
			this.juice -= dashJuice;
			this.dx += 5 * x * this.speed;
			this.dy += 5 * y * this.speed;
		}
	},
	recharge: function(howMuch) {
		this.juice = Math.min(maxJuice, this.juice + howMuch);
	}
};

//the body
const $player = $("<div>", {id: "player"});

$player.css({
	left: player.x,
	top: player.y,
	width: player.width,
	height: player.height
});


$player.appendTo($rectangle);
