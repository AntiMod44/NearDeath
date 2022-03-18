document.getElementById("Botton").addEventListener("mouseover", playBottonAnim);
document.getElementById("Botton").addEventListener("mouseout", stopPlayBottonAnim);
function playBottonAnim() {
	document.querySelector(".playBoton").style.background = "linear-gradient(to bottom, #77a809 5%, #89c403 100%)";
}

function stopPlayBottonAnim() {
	document.querySelector(".playBoton").style.background = "linear-gradient(to bottom, #89c403 5%, #77a809 100%)";
}

document.querySelector(".GameOverButton").addEventListener("mouseover", gameOverAnim);
document.querySelector(".GameOverButton").addEventListener("mouseout", stopGameOverAnim);
function gameOverAnim() {
	document.querySelector(".GameOverButton").style.background = "linear-gradient(to bottom, #2561c2 5%, #377ced 100%)";
}

function stopGameOverAnim() {
	document.querySelector(".GameOverButton").style.background = "linear-gradient(to bottom, #377ced 5%, #2561c2 100%)";
}

document.querySelector(".backToMainMenu").addEventListener("mouseover", backMenuAnim);
document.querySelector(".backToMainMenu").addEventListener("mouseout", stopBackMenuAnim);
function backMenuAnim() {
	document.querySelector(".backToMainMenu").style.background = "linear-gradient(to bottom, #2561c2 5%, #377ced 100%)";
}

function stopBackMenuAnim() {
	document.querySelector(".backToMainMenu").style.background = "linear-gradient(to bottom, #377ced 5%, #2561c2 100%)";
}

let Normal = true;
let Hard = false;
let Insane = false;

document.querySelector('#Dificult').addEventListener('change', () => {
	var ind = document.querySelector('#Dificult');
	var value = ind.options[ind.selectedIndex].value;
	switch (value) {
		case "i":
			Insane = true;
			Normal = Hard = false;
			document.getElementById("dificultDiv").style.backgroundColor = "#ff1500";
			break;
		case "h":
			Hard = true;
			Normal = Insane = false;
			document.getElementById("dificultDiv").style.backgroundColor = "#ffff00";
			break;
		default:
			Normal = true;
			Hard = Insane = false;
			document.getElementById("dificultDiv").style.backgroundColor = "#00db0f";
			break;
	}
});

const gameOver = document.querySelector(".GameOver");

//Making game context
var canvas = document.querySelector("#gameUI");
const be = canvas.getContext("2d");

const scoreDiv = document.getElementById("scoreElement");
const gameOverButton = document.querySelector(".GameOverButton");

//Canvas align

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(gsap);
console.log(be);

setInterval( () => {
	if(canvas.width != window.innerWidth || canvas.height != window.innerHeight) {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
		canvas2.width = window.innerWidth;
		canvas2.height = window.innerHeight;
	}
}, 250);

function degressToRadian(angle) {
	return (angle*Math.PI)/180;
}

class Player {
	constructor(x, y, radius, color) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
	}
	
	draw() {
		be.beginPath();
		be.fillStyle = this.color;
		be.strokeStyle = "#f7f7f7";
		be.lineWidth = 2 + this.radius / 4;
		be.arc(this.x, this.y, this.radius, degressToRadian(0), degressToRadian(360))
		be.stroke();
		be.fill();
	}
}

class Projectile {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
	}
	
	draw() {
		be.beginPath();
		be.fillStyle = this.color;
		be.strokeStyle = "#00eded";
		be.lineWidth = 1 + this.radius / 5;
		be.arc(this.x, this.y, this.radius, degressToRadian(0), degressToRadian(360));
		be.stroke();
		be.fill();
	}
		
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

class Enemy {
	constructor(x, y, radius, color, velocity, maxRadius) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.maxRadius = maxRadius
	}
	
	draw() {
		be.beginPath();
		be.fillStyle = this.color;
		be.arc(this.x, this.y, this.radius, degressToRadian(0), degressToRadian(360))
		be.fill();
		
		//healthBar
		be.beginPath();
		be.zIndex = 1;
		be.fillStyle = "black";
		be.roundRect(this.x - this.maxRadius - 4, this.y - this.radius - 26, 2 * this.maxRadius + 8, 8 + 8, 6);
		be.fill();
		be.closePath();
		be.beginPath();
		be.fillStyle = "#8ecc51";
		be.roundRect(this.x - this.maxRadius, this.y - this.radius - 26 + 4, 2 * this.radius, 8, 5);
		be.fill();
		be.closePath();
	}
	
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

var playerY = 0;
var playerX = 0;
var keys = [];

window.addEventListener("keydown", function(e) {
	keys[e.keyCode] = true;
});

window.addEventListener("keyup", function(e) {
	keys[e.keyCode] = false;
});

function init2() {
	playerX = window.innerWidth / 2;
	playerY = window.innerHeight / 2;
}

init2();

let mouseY;
let mouseX;

let projectiles = [];
let enemies = [];

window.addEventListener("mousemove", (event) => {
	mouseY = event.clientY;
	mouseX = event.clientX;
});

let player = new Player(playerX, playerY, 18, "white");

function render() {
	let turret = new Image();
	turret.src = "https://cdn.discordapp.com/attachments/879459211594043432/944751976120475658/Turret.png";
	player = new Player(playerX, playerY, 13, "white"),be.save(),
	be.translate(playerX, playerY),
	be.rotate(Math.atan2(mouseY - playerY, mouseX - playerX)),
	be.beginPath(),
	be.zIndex = 1,
	be.drawImage(turret, -34/2, -34/2, 34, 34),
	be.restore()
}

let animationId;
var fpsDisplay = 0;
let stopShowFPS = false;
let score = 0;
let lastRadius;
	
function init() {
	init2();
	score = 0;
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	player = new Player(playerX, playerY, 13, "white");
	projectiles = [];
	particles = [];
	enemies = [];
}

function update() {
	if(player.x - player.radius > canvas.width - 30) {
		playerX -= 4;
	} else if(player.y - player.radius > canvas.height - 30) {
		playerY -= 4;
	} else if(player.x - player.radius <= 0) {
		playerX += 4;
	} else if(player.y - player.radius <= 0) {
		playerY += 4;
	}
	if(keys[87] == true && keys[65] == true || keys[38] == true && keys[37] == true) {// up left
		playerY -= 2;
		playerX -= 2;
	} else if(keys[87] == true && keys[68] == true || keys[38] == true && keys[39] == true) {// up right
		playerY -= 2;
		playerX += 2;
	} else if(keys[83] == true && keys[68] == true || keys[40] == true && keys[39] == true) {// down right
		playerY += 2;
		playerX += 2;
	} else if(keys[83] == true && keys[65] == true || keys[40] == true && keys[37] == true) {// down left
		playerY += 2;
		playerX -= 2;
	} else if(keys[87] == true || keys[38] == true) {// up
		playerY -= 2;
	} else if(keys[65] == true || keys[37] == true) {// left
		playerX -= 2;
	} else if(keys[68] == true || keys[39] == true) {// right
		playerX += 2;
	} else if(keys[83] == true || keys[40] == true) {// down
		playerY += 2;
	}
}

function spawnEnemy() {
	setInterval( () => {
		if(document.getElementById("MainMenu").style.display == "none") {
			let VPR = (Normal == true ? 1 : (Hard == true ? 1.5 : (Insane == true ? 2.3 : 1)));
			const radius = Math.random() * (50 - 5) + 5;
			let x
			let y
			
			if(Math.random() < 0.5) {
				x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
				y = Math.random() * canvas.height;
			} else {
				x = Math.random() * canvas.width;
				y = Math.random() < 0.5 ? 0 - radius : canvas.height + radius;
			}
			
			const color = `hsl(${Math.random() * 360}, 100%, 50%)`;
			const angle = Math.atan2(playerY - y, playerX - x);
			
			const velocity = {
				x: Math.cos(angle) * VPR,
				y: Math.sin(angle) * VPR
			}
			
			enemies.push(new Enemy(x, y, radius, color, velocity, radius));
		}
	}, 1300);
}

function animate() {
	fpsDisplay++;
	let name = document.getElementById("eName").value;
	animationId = requestAnimationFrame(animate);
	be.fillStyle = "rgba(0, 0, 0, 0.1)";
	be.fillRect(0, 0, canvas.width, canvas.height);
	document.querySelector("#scoreElement").innerHTML = "score:&nbsp;" + score;
	if(document.getElementById("eName").value == "") {
		document.getElementById("nameUI").innerHTML = "annonimous";
	} else {
		document.getElementById("nameUI").innerHTML = name;
	}
	document.getElementById("nameUI").style.top = playerY + 20 + "px";
	document.getElementById("nameUI").style.left = playerX + "px";
	player.draw();
	update();
		
	projectiles.forEach((projectile, index) => {
		projectile.update();
		if(projectile.x - projectile.radius <= 0 || projectile.x - projectile.radius > canvas.width - 8
		|| projectile.y - projectile.radius <= 0 || projectile.y - projectile.radius > canvas.height - 8) {
			projectiles.splice(index, 1);
		}
	});
	
	render();
	enemies.forEach((enemy, index) => {
		enemy.update();			

		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
			
		//End game
		if(dist - enemy.radius - player.radius < -9) {
			document.querySelector(".textGame").innerHTML = score;
			document.querySelector(".score").style.display = "none";
			document.getElementById("nameUI").style.display = "none";
			document.querySelector(".GameOver").style.display = "flex";
			document.querySelector(".Habilities").style.display = "none";
			document.getElementById("fpsDisplay").style.display = "none";
			document.querySelector("#scoreElement").style.display = "none";
			cancelAnimationFrame(animationId);
			stopShowFPS = true;
		}
		
		//When projectile touch enemy
		projectiles.forEach((projectile, projectileIndex) => {
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
			if(dist - enemy.radius - projectile.radius < 1) {
				
				if(enemy.radius - 10 > 4 && Normal == true) {
					
					//increase our score
					score += 74;
					scoreDiv.innerHTML = "score:&nbsp;" + score;
					
					gsap.to(enemy, {
						radius: enemy.radius - 10
					}),
					projectiles.splice(projectileIndex, 1)
				} else if(enemy.radius - 10 > 2 && Hard == true) {
					
					//increase our score
					score += 63;
					scoreDiv.innerHTML = "score:&nbsp;" + score;
					
					gsap.to(enemy, {
						radius: enemy.radius - 7
					}),
					projectiles.splice(projectileIndex, 1)
				} else if(enemy.radius - 10 > 0 && Insane == true) {
					
					//increase our score
					score += 48;
					scoreDiv.innerHTML = "score:&nbsp;" + score;
					
					gsap.to(enemy, {
						radius: enemy.radius - 5
					}),
					projectiles.splice(projectileIndex, 1)
				} else if(Insane == true || Hard == true || Normal == true) {
					enemies.splice(index, 1), projectiles.splice(projectileIndex, 1),
					score += 189,
					scoreDiv.innerHTML = "score:&nbsp;" + score,
					scoreDiv.innerHTML = "score:&nbsp;" + score
				}
			}
		});
	});
}
	
setInterval( () => {
	if(stopShowFPS == false) {
		document.getElementById("fpsDisplay").innerHTML = "FPS:&nbsp;" + fpsDisplay;
		fpsDisplay = 0;
		}
}, 1000);
	
document.addEventListener('mousedown', (event) => {//spawn projectile
	if(event.which == 1) {
		if(document.getElementById("MainMenu").style.display == "none") {
			const angle = Math.atan2(event.clientY - playerY, event.clientX - playerX);
			
				const velocity = {
				x: Math.cos(angle) * 5,
				y: Math.sin(angle) * 5
			}
			
			projectiles.push(new Projectile(playerX, playerY, 4, "#00ffff", velocity));
		}
	}
});
	
document.querySelector(".GameOverButton").addEventListener('click', () => {//restart game
	init();
	score = 0;
	animate();
	spawnEnemy();
	stopShowFPS = false;
	document.querySelector("#scoreElement").style.display = "block";
	document.getElementById("fpsDisplay").style.display = "block";
	document.querySelector(".Habilities").style.display = "flex";
	document.querySelector(".GameOver").style.display = "none";
	document.querySelector(".score").style.display = "block";
	document.getElementById("nameUI").style.display = "block";
	document.querySelector("#scoreElement").innerHTML = "score:&nbsp;" + score;
});

document.querySelector(".backToMainMenu").addEventListener('click', () => {//back to menu
	document.getElementById("nameUI").style.display = "none";
	document.getElementById("gameUI").style.display = "none";
	document.querySelector(".GameOver").style.display = "none";
	document.getElementById("MainMenu").style.display = "block";
	document.querySelector(".Habilities").style.display = "none";
	document.querySelector(".fpsDisplay").style.display = "none";
});

document.getElementById("Botton").addEventListener('click', () => {//start game
	setTimeout( () => {
		init();
		score = 0;
		animate();
		spawnEnemy();
		stopShowFPS = false;
		document.querySelector("body").style.display = "flex";
		document.getElementById("nameUI").style.display = "block";
		document.querySelector(".score").style.display = "block";
		document.getElementById("gameUI").style.display = "flex";
		document.querySelector("#scoreElement").innerHTML = "score:&nbsp;" + score;
		document.getElementById("MainMenu").style.display = "none";
		document.querySelector(".Habilities").style.display = "flex";
		document.querySelector(".fpsDisplay").style.display = "block";
	}, 1000);
});