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

var canvas = document.querySelector("canvas");
const be = canvas.getContext("2d");

const scoreDiv = document.getElementById("scoreElement");
const gameOverButton = document.querySelector(".GameOverButton");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

console.log(gsap);
console.log(be);

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
		be.arc(this.x, this.y, this.radius, degressToRadian(0), degressToRadian(360))
		be.fill();
	}
	
	update() {
		this.draw()
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
	}
}

const friction = 0.99;
class Particle {
	constructor(x, y, radius, color, velocity) {
		this.x = x
		this.y = y
		this.radius = radius
		this.color = color
		this.velocity = velocity
		this.alpha = 1
	}
	
	draw() {
		be.save();
		be.beginPath();
		be.globalAlpha = this.alpha;
		be.fillStyle = this.color;
		be.arc(this.x, this.y, this.radius, degressToRadian(0), degressToRadian(360))
		be.fill();
		be.restore();
	}
	
	update() {
		this.draw()
		this.velocity.x *= friction
		this.velocity.y *= friction
		this.x = this.x + this.velocity.x
		this.y = this.y + this.velocity.y
		this.alpha -= 0.01
	}
}

class Boundary {
	constructor({ position }) {
		this.position = position;
		this.width = 40;
		this.height = 40;
	}
	
	draw() {
		be.fillStyle = "blue";
		be.fillRect(this.position.x, this.position.y, this.width, this.height);
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
let player = new Player(playerX, playerY, 13, "white");

function render() {
	player = new Player(playerX, playerY, 13, "white");
}

let projectiles = [];
let particles = [];
let enemies = [];

let animationId;
var fpsDisplay = 0;
let stopShowFPS = false;
let score = 0;

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
	if(player.x - player.radius > canvas.width) {
		playerX -= 4;
	} else if(player.y - player.radius > canvas.height) {
		playerY -= 4;
	} else if(player.x - player.radius < 0) {
		playerX += 4;
	} else if(player.y - player.radius < 0) {
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
			
			enemies.push(new Enemy(x, y, radius, color, velocity));
		}
	}, 1600);
}

function animate() {
	fpsDisplay++;
	animationId = requestAnimationFrame(animate);
	be.fillStyle = "rgba(0, 0, 0, 0.1)";
	be.fillRect(0, 0, canvas.width, canvas.height);
	player.draw();
	render();
	update();
	
	particles.forEach((particle, index) => {
		if(particle.alpha <= 0) {
			particles.slice(index, 1);
		} else {
			particle.update();
		}
	});
	
	projectiles.forEach((projectile, index) => {
		projectile.update();
		if(projectile.x - projectile.radius < 0 || projectile.x - projectile.radius > canvas.width
		|| projectile.y - projectile.radius < 0 || projectile.y - projectile.radius > canvas.height) {
			setTimeout( () => {
				projectiles.splice(index, 1);
			}, 0);
		}
	});
	
	enemies.forEach((enemy, index) => {
		enemy.update();
		
		const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);
		
		//End game
		if(dist - enemy.radius - player.radius < -12.5) {
			document.querySelector(".textGame").innerHTML = score;
			document.querySelector(".GameOver").style.display = "flex";
			cancelAnimationFrame(animationId);
			stopShowFPS = true;
		}
		
		//When projectile touch enemy
		projectiles.forEach((projectile, projectileIndex) => {
			const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
			if(dist - enemy.radius - projectile.radius < 1) {
								
				//create explocions
				for(let i = 0;i < enemy.radius * 2; i++) {
					particles.push(new Particle(projectile.x, projectile.y, Math.random() * 3, enemy.color, {
						x: (Math.random() - 0.5) * (Math.random() * 6),
						y: (Math.random() - 0.5) * (Math.random() * 6)
					}));
				}
				
				if(enemy.radius - 10 > 6) {
					
					//increase our score
					score += 72;
					scoreDiv.innerHTML = score;
					
					gsap.to(enemy, {
						radius: enemy.radius - 10
					});
					setTimeout( () => {
						projectiles.splice(projectileIndex, 1);
					}, 0);
				} else {
					setTimeout( () => {
						enemies.splice(index, 1);
						projectiles.splice(projectileIndex, 1);
						scoreDiv.innerHTML = score;
						score += 187;
					}, 0);
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

addEventListener('click', (event) => {//spawn projectile
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
	document.querySelector("#scoreElement").innerHTML = score;
	document.querySelector(".GameOver").style.display = "none";
});

document.querySelector(".backToMainMenu").addEventListener('click', () => {//back to menu
	document.getElementById("gameUI").style.display = "none";
	document.querySelector(".GameOver").style.display = "none";
	document.getElementById("MainMenu").style.display = "block";
	document.querySelector(".fpsDisplay").style.display = "none";
});

document.getElementById("Botton").addEventListener('click', () => {//start game
	setTimeout( () => {
		init();
		score = 0;
		animate();
		spawnEnemy();
		stopShowFPS = false;
		document.querySelector("#scoreElement").innerHTML = score;
		document.getElementById("gameUI").style.display = "flex";
		document.querySelector(".fpsDisplay").style.display = "block";
		document.getElementById("MainMenu").style.display = "none";
	}, 1000);
});