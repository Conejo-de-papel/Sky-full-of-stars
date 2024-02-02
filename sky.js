const codeURL = document.querySelector('script[src^="blob"]').getAttribute('src');
let code;

const bugs = [];
let circles = [];
let fishX, fishY;
let speed = 0.05;
let img;

function preload() {
  img = loadImage('gatito.png'); // Replace 'your_image_path.jpg' with the path to your image file
	code = loadStrings(codeURL);
}

function setup() {
  createCanvas(800, 700);
  const now = millis();
  for (let i = 0; i < 100; i++) {
    const initialPosition = createVector(random(width), random(height));
    bugs.push({
      angle: random(TWO_PI),
      position: initialPosition,
      targetPosition: initialPosition.copy(),
      nextUpdate: now + random(500, 3000),
    });
  }
  
  fishX = width / 2; // Set initial fish position to the center of the canvas
  fishY = height / 2;
}

function draw() {
  background('#0f173b');

  const now = millis();
  for (const bug of bugs) {
    const targetX = fishX; // Use fish position as the target instead of mouseX and mouseY
    const targetY = fishY;

    if (
      dist(bug.position.x, bug.position.y, targetX, targetY) < 100 &&
      dist(bug.targetPosition.x, bug.targetPosition.y, targetX, targetY) < 100
    ) {
      const off = bug.position.copy().sub(createVector(targetX, targetY)).setMag(random(20, 100));
      bug.targetPosition.add(off);
    }

    const distToTarget = bug.position.dist(bug.targetPosition);
    if (distToTarget > 0.1) {
      const targetAngle = atan2(
        bug.targetPosition.y - bug.position.y,
        bug.targetPosition.x - bug.position.x
      );
      bug.angle += (targetAngle - bug.angle) * 0.05;
      bug.position.add(createVector(
        distToTarget * 0.1 * cos(targetAngle),
        distToTarget * 0.1 * sin(targetAngle)
      ));
    }
    if (bug.nextUpdate <= now) {
      const isOffscreen =
        bug.position.x < 0 ||
        bug.position.x > width ||
        bug.position.y < 0 ||
        bug.position.y > height;
      const newAngle =
        isOffscreen
          ? atan2(height/2 - bug.position.y, width/2 - bug.position.x) + random(-0.1,0.1) * PI
          : bug.angle + random(-0.2, 0.2) * PI;
      const d = random(10, 50);
      const off = createVector(cos(newAngle), sin(newAngle)).mult(d);
      bug.targetPosition = bug.targetPosition.copy().add(off);
      bug.nextUpdate = now + random(100, 5000);
    }

    push();
    translate(bug.position.x, bug.position.y);
    rotate(bug.angle);
    noStroke();
    fill('#FFFF00');
    beginShape();
    const radius1 = 15;
    const radius2 = 8;
    const numPoints = 5;
    for (let i = 0; i < numPoints * 2; i++) {
      const angle = i * PI / numPoints;
      const radius = i % 2 === 0 ? radius1 : radius2;
      const x = cos(angle) * radius;
      const y = sin(angle) * radius;
      vertex(x, y);
    }
    endShape(CLOSE);
    fill('#FFFFFF');
    circle(0, 0, 10);
    pop();
  }

  fishX += speed * (mouseX - fishX);
  fishY += speed * (mouseY - fishY);
  circles.push(new CircleTrace(fishX, fishY));

  for (let i = 0; i < circles.length; i++) {
    circles[i].show();
    circles[i].update();
    if (circles[i].isDone()) circles.splice(i, 1);
  }
}

class CircleTrace {
  constructor(_x, _y) {
    this.x = _x;
    this.y = _y;
    this.d = 80;
    this.hue = 0;
  }

  show() {
    noStroke();
    fill('#ed8cbd');
    ellipse(this.x, this.y, this.d);
		
   // Draw fish body
    imageMode(CENTER);
    image(img, this.x, this.y, this.d, this.d);
  }

  update() {
    this.d -= 2;
    this.hue += 1;
  }

  isDone() {
    if (this.d <= 0) return true;
    else return false;
  }
}
