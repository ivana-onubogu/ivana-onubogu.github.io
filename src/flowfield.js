// GLOBAL VARIABLES
let		particles = [];
const	number_of_particles = 5000;

let		noiseScale;
let		noiseScaleDefault = 0.007;
let		noiseScaleEffect = 0.0009;
let 	direction;
let		directionEffect = 4;
let		speed;
let		speedDefault = 1.2;
let		speedEffect = 2;
let		strokeWeightDefault = 1;
let		strokeWeightEffect = 1;

let		color1;
let		color2;
let		color3;
let		color4;
let		color5;

let		h_pressed = false;
let		i_pressed = false;
let		j_pressed = false;
let		k_pressed = false;
let		l_pressed = false;
let		w_pressed = false;
let		e_pressed = false;
let		g_pressed = false;
let		r_pressed = false;
let		t_pressed = false;
let		y_pressed = false;
let		u_pressed = false;
let		p_pressed = false;
let		o_pressed = false;

let 	previousSpeedTimeout;
let		previousStrokeTimeout
let 	effectDuration = 3000;

// INITIAL CANVAS SETUP
function setup()
{
	const canvas = createCanvas(window.innerWidth, window.innerHeight);

	canvas.parent("canvas_location");
	for(let i = 0; i < number_of_particles; i++) 
		particles.push(createVector(random(width), random(height)));
	strokeWeight(strokeWeightDefault);
	color1 = 255;
	color2 = color(173, 255, 47);
	color3 = color(248, 51, 60); 
	color4 = color(43, 158, 179);
	color5 = color(228, 208, 10);
	speed = speedDefault;
	clear();
}
// DRAWING THE FLOW FIELD
function draw()
{
	fill_background();

	for(let i = 0; i < number_of_particles; i++) 
	{
		let particle = particles[i];
		
		get_stroke_color(i);
		get_stroke_weight();
		point(particle.x, particle.y);
		get_particle_direction(particle);
		if (!o_pressed)
			update_particle_position(particle);
		if(!particle_is_on_screen(particle)) 
		{
			particle.x = random(width);
			particle.y = random(height);
		}
	}
}
// USER RECORDING
var video = document.querySelector("#video");
var startRecord = document.querySelector("#startRecord");
var stopRecord = document.querySelector("#stopRecord");
var downloadLink = document.querySelector("#downloadLink");

window.onload = async function(){
  stopRecord.style.display = "none";
  videoStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
  video.srcObject = videoStream;
}

startRecord.onclick = function(){
  startRecord.style.display = "none";
  stopRecord.style.display = "inline";

  mediaRecorder = new MediaRecorder(videoStream);

  let blob = [];
  mediaRecorder.addEventListener('dataavailable', function(e){
	blob.push(e.data);
  })

  mediaRecorder.addEventListener('stop', function(){
	var videoLocal = URL.createObjectURL(new Blob (blob));
	downloadLink.href = videoLocal;
  })

  mediaRecorder.start();
}

stopRecord.onclick = function(){
  mediaRecorder.stop();
}
//EFFECTS FOLLOW 
function fill_background()
{
	if (r_pressed || t_pressed)
		background(0, 0);
	else if (p_pressed)
		background(0, 5);
	else if (i_pressed)
		background(0, 7)
	else
		background(0, 10);
}
// changes color
function get_stroke_color(i)
{
	if (speed == speedDefault && !i_pressed)
	{
		stroke(select_default_color(i));
	}
	else if (h_pressed)
		stroke(color1);
	else if (a_pressed)
		stroke(color(random(0,255), random(0,255), random(0,255)));
	else if (c_pressed)
		stroke(color5);
	else if (j_pressed)
		stroke(color2);
	else if (k_pressed)
		stroke(color3);
	else if (l_pressed)
		stroke(color4);
	else if (i_pressed)
		stroke(color(random(0,255), random(0,255), random(0,255)));
	}
//
function select_default_color(i)
{
	if (i % 5 == 0)
		return (color(random(100, 255), random(100, 200), random(100, 255)));
	else if (i % 3 == 0)
		return (color3);
	else if (i % 2 == 0)
		return (color2);
	else
		return (color5);
}
// increases stroke weight
function get_stroke_weight()
{
	if (w_pressed || e_pressed)
		strokeWeight(strokeWeightEffect);
	else
		strokeWeight(strokeWeightDefault);
}
// changes direction, uses vectors
function get_particle_direction(particle)
{
	if (u_pressed)
		direction = directionEffect;
	else if (p_pressed)
	{
		let screen_center = createVector(width / 2, height / 2);
		direction = p5.Vector.sub(particle, screen_center).normalize();
	}
	else if (o_pressed)
	{
		let screen_center = createVector(width / 2, height / 2);
		let angle = atan2(particle.y - screen_center.y, particle.x - screen_center.x);

    	let radius = dist(particle.x, particle.y, screen_center.x, screen_center.y);
		angle += radians(speed / 3);
		
		particle.x = screen_center.x + radius * cos(angle); // update pos, move to pos func?
    	particle.y = screen_center.y + radius * sin(angle);
	}
	else
	{
		if (y_pressed)
			noiseScale = noiseScaleEffect;
		else
			noiseScale = noiseScaleDefault;
		let noise_value = noise(particle.x * noiseScale, particle.y * noiseScale, frameCount * noiseScale * noiseScale);
		direction = TAU * noise_value;
	}
}

function update_particle_position(particle)
{
	if (p_pressed)
		particle.add(p5.Vector.mult(direction, speed));
	else
	{
		particle.x += cos(direction) * speed;
		particle.y += sin(direction) * speed;
	}
}

function particle_is_on_screen(particle)
{
	if (particle.x >= 0 && particle.x <= width && particle.y >= 0 && particle.y <= height)
		return (true);
	else
		return (false);
}

// VISUAL EFFECTS TRIGGERED BY KEY PRESSES
function keyPressed() 
{
	if (key == 'z' || key == 'Z')
	{
		slowDown(0.3);
	}
	else if (key == 'x' || key == 'X') 
	{
		revertSpeed();
		clearTimeout(previousSpeedTimeout);
		x_pressed = true;
		slowDown(90);
	}
	else if (key == 'c' || key == 'C') 
	{
		glitches(50);
		slowDown(30);
	}
	else if (key == 'v' || key == 'V') 
	{
	//   do something
	}
	else if (key == 'b' || key == 'B') 
	{
		glitches(10);
		slowDown(1);
	}
	else if (key == 'n' || key == 'N') 
	{
	//   do something
	}
	else if (key == 'm' || key == 'M') 
	{
		revertSpeed();
		clearTimeout(previousSpeedTimeout);
		m_pressed = true;
		slowDown(90);
		strokeGrow(25);
	}
	else if (key == 'a' || key == 'A') 
	{
		background(color(0, 115, 34));
		revertSpeed();
		clearTimeout(previousSpeedTimeout);
		x_pressed = true;
		slowDown(100);
		strokeWeightDefault++;
	}
	else if (key == 's' || key == 'S') 
	{
		background(color(random(3, 255), random(240,255), random (110, 155)));
	}
	else if (key == 'd' || key == 'D') 
	{
		background(color(random(3, 255), random(240,255), random (110, 155)));

	}
	else if (key == 'f' || key == 'F') 
	{
	 	background(random(3, 255), random(240,255), random (110, 155));
	}
	else if (key == 'g' || key == 'G') 
	{
		background(color(random(100, 255), random(100, 200), random(100, 255)));
	}
	else if ((key == 'h' || key == 'H') && !i_pressed) 
	{
		revertSpeed();
		speed = speedEffect;
		h_pressed = true;
		clearTimeout(previousSpeedTimeout);
		previousSpeedTimeout = setTimeout(revertSpeed, effectDuration);
	}
	else if ((key == 'j' || key == 'J') && !i_pressed) 
	{
		revertSpeed();
		speed = speedEffect;
		j_pressed = true;
		clearTimeout(previousSpeedTimeout);
		previousSpeedTimeout = setTimeout(revertSpeed, effectDuration);
	}
	else if ((key == 'k' || key == 'K') && !i_pressed) 
	{
		revertSpeed();
		speed = speedEffect;
		k_pressed = true;
		clearTimeout(previousSpeedTimeout);
		previousSpeedTimeout = setTimeout(revertSpeed, effectDuration);
	}
	else if ((key == 'l' || key == 'L') && !i_pressed) 
	{
		revertSpeed();
		speed = speedEffect;
		l_pressed = true;
		clearTimeout(previousSpeedTimeout);
		previousSpeedTimeout = setTimeout(revertSpeed, effectDuration);
	}
	else if (key == 'q' || key == 'Q') 
	{
		glitches(40);
		
	}
	else if ((key == 'w' || key == 'W') && !w_pressed && !e_pressed) 
	{
		w_pressed = true;
		strokeGrow(40);
	}
	else if (key == 'e' || key == 'E' && !e_pressed && !w_pressed) 
	{
		e_pressed = true;
		strokeGrow(60);
	}
	else if ((key == 'r' || key == 'R') && !r_pressed && !t_pressed) 
	{
		r_pressed = true;
		setTimeout(revertR, effectDuration * 15);
	}
	else if ((key == 't' || key == 'T') && !t_pressed && !r_pressed)
	{
		t_pressed = true;
		setTimeout(revertT, effectDuration * 10);
	}
	else if ((key == 'y' || key == 'Y') && !y_pressed)
	{
	 	y_pressed = true;
		setTimeout(revertY, effectDuration * 3);
	}
	else if ((key == 'u' || key == 'U') && !u_pressed)
	{
		u_pressed = true;
		setTimeout(revertU, effectDuration);
	}
	else if ((key == 'i' || key == 'I') && !i_pressed)
	{
		revertSpeed();
		clearTimeout(previousSpeedTimeout);
		i_pressed = true;
		slowDown(41);
	}
	else if ((key == 'o' || key == 'O') && !o_pressed && !p_pressed)
	{
		o_pressed = true;
	 	setTimeout(revertO, effectDuration * 2);
	}
	else if ((key == 'p' || key == 'P') && !p_pressed) 
	{
		p_pressed = true;
		setTimeout(revertP, 9000);
	}
	if (key == ' ')
	{
		revertAll();
	}
}

// EFFECT FUNCTIONS
function glitches(number)
{
	if (number > 0)
	{
		noiseSeed(random(0, 75));
		setTimeout(() => glitches(number - 1), 30);
	}
}

function slowDown(number)
{
	if (number > 35)
	{
		speed += 0.3;
		setTimeout(() => slowDown(number - 1), 50);
	}
	else if (number > 1)
	{
		speed -= 0.2;
		setTimeout(() => slowDown(number - 1), 50);
	}
	else if (number == 1)
	{
		speed -= 0.2;
		setTimeout(() => slowDown(number - 1), 5000);
	}
	else if (number == 0)
		revertI();
}

function strokeGrow(number)
{
	if (number > 20)
	{
		strokeWeightEffect += 0.5;
		setTimeout(() => strokeGrow(number - 1), 30);
	}
	else if (number > 80) {
		strokeWeightEffect += 0.8;
		setTimeout(() => strokeGrow (number - 1), 30 );
	}
	else if (number > 0 && w_pressed)
	{
		strokeWeightEffect -= 0.5;
		setTimeout(() => strokeGrow(number - 1), 30);
	}
	else if (number > 0 && e_pressed)
	{
		strokeWeightEffect -= 0.20;
		setTimeout(() => strokeGrow(number - 0.2), 60);
	}
	else if (number > 0 && z_pressed){
		strokeWeightEffect -= 0.3;
		setTimeout(() => strokeGrow(number - 1), 30);
	}
	else if (number <= 0)
	{
		revertW();
		revertE();
	}
}


//RESET EFFECT FUNCTIONS

function revertAll()
{
	revertSpeed();
	revertE();
	revertG();
	revertI();
	revertO();
	revertP();
	revertR();
	revertT();
	revertU();
	revertW();
	revertZ();
}

function revertSpeed()
{
	if (speed == speedEffect)
		speed = speedDefault;
	h_pressed = false;
	j_pressed = false;
	k_pressed = false;
	l_pressed = false;
}

function revertE()
{
	e_pressed = false;
	strokeWeightEffect = strokeWeightDefault;
}

function revertG()
{
	g_pressed = false;
}

function revertI()
{
	i_pressed = false;
	speed = speedDefault;
}

function revertP()
{
	p_pressed = false;
}

function revertO()
{
	o_pressed = false;
}

function revertR()
{
	r_pressed = false;
}

function revertT()
{
	t_pressed = false;
}

function revertU()
{
	u_pressed = false;
}

function revertY()
{
	y_pressed = false;
}

function revertW()
{
	w_pressed = false;
	strokeWeightEffect = strokeWeightDefault;
}