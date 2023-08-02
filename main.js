let engine;
let player;
let objects = [];
let frictionCoefficient = 0.05;
let maxPlayerSpeed = 3;
let pushForce = 0.2;
let airResistance = 0.05;
let keyIsPressed = false;

function setup() {
  createCanvas(windowWidth, windowHeight);
  engine = Matter.Engine.create({ gravity: { x: 0, y: 0 } });
  Matter.Engine.run(engine);

  // Créer le joueur
  let playerOptions = {
    friction: 0.05,
    restitution: 0.6
  };
  player = Matter.Bodies.circle(width / 2, height / 2, 30, playerOptions);
  Matter.World.add(engine.world, player);

  // Créer les objets
  for (let i = 0; i < 50; i++) {
    let objectType = floor(random(7)); // 0: Square, 1: Triangle, 2: Pentagon, 3: Hexagon, 4: Heptagon
    objects.push(createGameObject(random(1000), random(1000), objectType));
  }
}

function draw() {
  background(220);

  // Déplacer la caméra pour suivre le joueur
  translate(width / 2 - player.position.x, height / 2 - player.position.y);

  // Mettre à jour le moteur de physique
  Matter.Engine.update(engine);

  // Appliquer les forces en fonction des touches enfoncées
  applyPlayerForces();

  // Afficher le joueur
  fill(255, 0, 0);
  ellipse(player.position.x, player.position.y, player.circleRadius * 2);

  // Afficher les objets
  for (let obj of objects) {
    displayGameObject(obj);
  }
}

function applyPlayerForces() {
  let force = createVector(0, 0);

  if (keyIsPressed) {
    if (keyIsDown(UP_ARROW) || keyIsDown(87)) {
      force.y -= 0.2;
    }
    if (keyIsDown(DOWN_ARROW) || keyIsDown(83)) {
      force.y += 0.2;
    }
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      force.x -= 0.2;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      force.x += 0.2;
    }
  }

  player.force = force.mult(0.1);
}

function createGameObject(x, y, type) {
  let options = {
    friction: 0.05,
    restitution: 0.6
  };

  let obj;

  if (type === 0) {
    obj = Matter.Bodies.rectangle(x, y, 40, 40, options);
  } else if (type === 1) {
    obj = Matter.Bodies.polygon(x, y, 3, 40, options);
  } else if (type === 2) {
    obj = Matter.Bodies.polygon(x, y, 5, 40, options);
  } else if (type === 3) {
    obj = Matter.Bodies.polygon(x, y, 6, 40, options);
  } else if (type === 4) {
    obj = Matter.Bodies.polygon(x, y, 7, 40, options);
  } else if (type === 5) {
    obj = Matter.Bodies.polygon(x, y, 8, 40, options);
  } else if (type === 6) {
    obj = Matter.Bodies.polygon(x, y, 9, 40, options);
  }

  Matter.World.add(engine.world, obj);

  return obj;
}

function displayGameObject(obj) {
  push();
  translate(obj.position.x, obj.position.y);
  rotate(obj.angle);
  fill(0, 0, 255);
  beginShape();
  for (let i = 0; i < obj.vertices.length; i++) {
    vertex(obj.vertices[i].x, obj.vertices[i].y);
  }
  endShape(CLOSE);
  pop();
}

function keyPressed() {
  keyIsPressed = true;
}

function keyReleased() {
  keyIsPressed = false;
}
