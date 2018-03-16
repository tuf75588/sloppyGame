function * colourGenerator() {
	function randByte() {
		return Math.floor(100 * Math.random()) + 120;
	}

	let [r, g, b] = [randByte(), randByte(), randByte()];
	yield `rgb(${r}, ${g}, ${b})`;

	while(true) {
		const newB = Math.floor((r - 100 + 60 * Math.random()) % 100 + 120);
		r = g;
		g = b;
		b = newB;

		yield `rgb(${r}, ${g}, ${b})`;
	}
}

function scoreUpdate() {
	$scoreboard.html(player.score);
}

function hiScoreUpdate() {
	$hiscoreboard.html(`hi: ${hiScore}`);
	localStorage.setItem("hiScore", hiScore);
}

function juiceUpdate() {
	const progress = 100 * player.juice / maxJuice;

	const readyToDash = player.juice > dashJuice;

	$progress.css({width: `${progress}%`, backgroundColor: readyToDash ? "rgba(255, 255, 255, 0.5)" : "rgba(255, 0, 0, 0.5)"});
	$ready.css({opacity: readyToDash ? 1 : 0})
}

function collisionCheck(sprite1, sprite2) {
	const [x1, y1, x2, y2] = [sprite1.x, sprite1.y, sprite2.x, sprite2.y];
	const [w1, h1, w2, h2] = [sprite1.width, sprite1.height, sprite2.width, sprite2.height];

	return ((x1 + w1 > x2 && x1 < x2 + w2) && (y1 + h1 > y2 && y1 < y2 + h2));
}

function setTheStage() {
	if(player.score > hiScore) {
		alert(`hey you did a hi score! it's ${player.score}`);
		hiScore = player.score;
	}

	hiScoreUpdate();

	player.width = 10;
	player.height = 10;
	player.x = Math.floor((width - player.width) * Math.random());
	player.y = Math.floor((height - player.height) * Math.random());
	player.dx = 0;
	player.dy = 0;
	player.speed = 2;
	player.score = 0;
	player.juice = maxJuice;
	player.mortalize();

	scoreUpdate();

	//reset the keys
	for(const key in keys) {
		keys[key] = 0;
	}

	//spawn some guys
	for(const guy of guys) {
		guy.remove();
		guys.delete(guy);
	}

	const guysToSpawn = 3;

	for(let i = 0; i < guysToSpawn; i++) {
		guys.add(spawnGuy());
	}

	//spawn some powerups
	for(const powerUp of powerUps) {
		powerUp.remove();
		powerUps.delete(powerUp);
	};

	powerUps.add(spawnPowerUp(randomType()));
	powerUps.add(spawnPowerUp(randomType()));
}

function centre(sprite) {
	return {
		x: sprite.x + sprite.width / 2,
		y: sprite.y + sprite.height / 2
	}
}

function gameFrame() {
	let [x, y] = [0, 0];

	[37, 38, 39, 40].forEach(code => {
		if(keys[code]) {
			const direction = directions[code];
			x += direction.x;
			y += direction.y;
		}
	})

	player.move(x, y);
	player.recharge(1);
	juiceUpdate();

	guys.forEach(guy => {
		guy.move();

		if(collisionCheck(player, guy)) {
			console.log(player.vincible);
			if(player.vincible) {
				alert("you died good job");
				setTheStage();
			} else {
				guy.remove();
				guys.delete(guy);
				player.score += 500;

				for(let i = 0; i < 2; i++) {
					guys.add(spawnGuy());
				}

				scoreUpdate();
			}
		}
	});

	powerUps.forEach(powerUp => {
		powerUp.flash();

		if(collisionCheck(powerUp, player)) {
			console.log(powerUp.type);
			player.powerUp(powerUp.type);
			powerUps.delete(powerUp);
			powerUp.remove();
			powerUps.add(spawnPowerUp(randomType()));
		}
	})
}


const scoreStorage = window.localStorage;
const colours = colourGenerator();
const minDistanceFromPlayer = 200;
let hiScore = localStorage.getItem("hiScore") || 0;

//create the playfield
const $rectangle = $("<div>", {id: "rectangle"});
const [width, height] = [640, 480];
$rectangle.css({width: width, height: height});
const $scoreboard = $("<div>", {id: "scoreboard", class: "overlay"});
$scoreboard.appendTo($rectangle);
const $hiscoreboard = $("<div>", {id: "hiscoreboard", class: "overlay"});
$hiscoreboard.appendTo($rectangle);
const $juicebar = $("<div>", {id: "juicebar", class: "overlay"});
const $container = $("<div>", {id: "juicecontainer"});
const $ready = $("<div>", {id: "ready"});
const $progress = $("<div>", {id: "progress"});
$progress.appendTo($container);
$ready.html("ready !!");
$ready.appendTo($container);
$container.appendTo($juicebar);
$juicebar.appendTo($rectangle);

let paused = false;

function togglePause() {
	paused = !paused;

	//eventually have like a paused text on screen or whatever maybe
}

const keys = {};

//arrow key listeners
$(window).on("keydown", event => {
	const keyCode = event.keyCode;
	keys[keyCode] = 1;

	if(keyCode === 80) {
		togglePause();
	}

	if(keyCode === 90) {
		let [x, y] = [0, 0];

		[37, 38, 39, 40].forEach(code => {
			if(keys[code]) {
				const direction = directions[code];
				x += direction.x;
				y += direction.y;
			}
		})

		player.dash(x, y);
	}
});

$(window).on("keyup", event => {
	const keyCode = event.keyCode;
	keys[keyCode] = 0;
});



$(document).ready(function() {
	$rectangle.appendTo("body");

	setTheStage();

	const gameLoop = setInterval(() => {if(!paused) gameFrame()}, 1000 / 60);
})