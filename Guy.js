/* AUTONOMOUS GUY SCRIPTS */


const newGuySize = 10;

//the soul
function Guy(x, y, id) {
	this.width = newGuySize;
	this.height = newGuySize;
	this.x = x;
	this.y = y;
	this.dx = 0;
	this.dy = 0;
	this.angry = true;
	this.id = id;
	this.speed = 3;
	this.attraction = 0.25 * Math.random() - 0.1;

	this.move = function() {
		const angle = 2 * Math.PI * Math.random();
		const magnitude = Math.random();

		//get player direction
		const [guyCentre, playerCentre] = [this, player].map(centre);
		const playerVector = {
			x: playerCentre.x - guyCentre.x,
			y: playerCentre.y - guyCentre.y
		}
		const vectorMagnitude = Math.sqrt(playerVector.x ** 2 + playerVector.y ** 2)
		const seekingChange = {
			x: playerVector.x * magnitude / vectorMagnitude,
			y: playerVector.y * magnitude / vectorMagnitude
		}

		const randomChange = {
			x: magnitude * Math.cos(angle),
			y: magnitude * Math.sin(angle)
		}

		const newDx = this.dx 
					  + this.attraction * seekingChange.x 
					  + (1 - Math.abs(this.attraction)) * randomChange.x; 
		const newDy = this.dy 
					  + this.attraction * seekingChange.y 
					  + (1 - Math.abs(this.attraction)) * randomChange.y; 

		this.dx = Math.min(this.speed, (Math.max(-this.speed, newDx)));
		this.dy = Math.min(this.speed, (Math.max(-this.speed, newDy)));

		const newX = this.x + this.dx;
		const newY = this.y + this.dy;

		this.x = Math.min(Math.max(0, newX), width - this.width);
		this.y = Math.min(Math.max(0, newY), height - this.height);

		//bounce
		if(this.x <= 0 || this.x + this.width >= width) this.dx *= -1;
		if(this.y <= 0 || this.y + this.height >= height) this.dy *= -1;

		guys.forEach(guy => {
			if(guy.id !== this.id && collisionCheck(guy, this)) {
				this.dx *= -1;
				this.dy *= -1;
				guy.dx *= -1;
				guy.dy *= -1;
			}
		})

		$(`#${this.id}`).css({
			width: this.width,
			height: this.height,
			left: this.x,
			top: this.y
		})
	}

	this.remove = function() {
		$(`#${this.id}`).remove();
	}
}

//the body
function spawnGuy() {
	//make a new guy, far enough away from the player
	let [x, y] = [Math.floor(Math.random() * (width - newGuySize)), 
				  Math.floor(Math.random() * (height - newGuySize))];
	let distance = Math.sqrt(
		(x - (player.x + player.width / 2)) ** 2 + 
		(y - (player.y + player.height / 2)) ** 2
	);

	while(distance < (minDistanceFromPlayer + player.width / 2)) {
		//too close! do another coordinates
		[x, y] = [Math.floor(Math.random() * (width - 20)), 
				  Math.floor(Math.random() * (height - 20))];
		distance = Math.sqrt((x - player.x) ** 2 + (y - player.y) ** 2);
	}

	const id = "guy" + (new Date().getTime()).toString() 
			   + (Math.floor(Math.random() * 1e9)).toString();
	const newGuy = new Guy(x, y, id);

	//render the guy on screen
	const $guy = $("<div>", {class: "guy", id: id});
	
	$guy.css({
		width: newGuy.width,
		height: newGuy.height,
		left: newGuy.x,
		top: newGuy.y,
		backgroundColor: colours.next().value
	})

	$guy.appendTo($rectangle);
	console.log(newGuy);

	return newGuy;
}

const guys = new Set();