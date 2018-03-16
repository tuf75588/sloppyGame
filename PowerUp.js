/* POWERUP SCRIPTS */


function textDisplay(x, y, msg) {
	//create a new div (class textDisplay)
	const $text = $("<div>", {class: "screenText"});
	$text.css({left: x, top: y});
	$text.html(msg);
	$text.appendTo($rectangle);

	//set a timeout to remove the div
	setTimeout(_ => elementRemove($text), 1000);
}

function elementRemove(element) {
	element.remove();
}


const powerUpScores = {
	"speed up": 250,
	"embiggen": 1000,
	"invincibility": 0,
	"replenish": 250
};

const powerUpTypes = [
	"speed up",
	"speed up",
	"embiggen",
	"invincibility",
	"replenish"
];

function shuffle(arr) {
	for(let i = arr.length - 1; i; i--) {
		//find a random index less than or equal to the current index
		const j = Math.floor(Math.random() * (i + 1));

		//do the swap
		[arr[i], arr[j]] = [arr[j], arr[i]];
	}

	return arr;
}


const randomType = (function generateRandomizer() {
	const queue = shuffle([...powerUpTypes]);
	const length = powerUpTypes.length;

	function randomizer() {
		if(queue.length < length) {
			queue.push(...shuffle([...powerUpTypes]));
		}

		return queue.shift();
	}

	return randomizer;
})();


//the soul
function PowerUp(x, y, id, type) {
	this.x = x;
	this.y = y;
	this.width = 30;
	this.height = 30;
	this.id = id;
	this.type = type;

	this.remove = function() {
		$(`#${this.id}`).remove();

		//flash the text
		textDisplay(this.x + this.width / 2, this.y + this.height / 2, this.type);
	}

	this.flash = function() {
		$(`#${this.id}`).css({backgroundColor: colours.next().value})
	}
}

//the body
function spawnPowerUp(type) {
	//make a new powerup, far enough away from the player
	let [x, y] = [Math.floor(Math.random() * (width - 30)), 
				  Math.floor(Math.random() * (height - 30))];
	let distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);

	while(distance < minDistanceFromPlayer) {
		//too close! do another coordinates
		[x, y] = [Math.floor(Math.random() * (width - 30)), 
				  Math.floor(Math.random() * (height - 30))];
		distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
	}

	const id = "powerup" + (new Date().getTime()).toString() 
			   + (Math.floor(Math.random() * 1e9)).toString();
	const newPowerUp = new PowerUp(x, y, id, type);

	//render the powerup on screen
	const $powerUp = $("<div>", {class: "powerup", id: id});
	
	$powerUp.css({
		width: newPowerUp.width,
		height: newPowerUp.height,
		left: newPowerUp.x,
		top: newPowerUp.y,
		backgroundColor: "#000"
	})

	$powerUp.appendTo($rectangle);
	console.log(newPowerUp);

	return newPowerUp;
}

const powerUps = new Set();