let player;
    let objects = [];
    let frictionCoefficient = 0.05;
    let maxPlayerSpeed = 5;
    let pushForce = 0.2;
    let airResistance = 0.05;
    let keyIsPressed = false;

    function setup() {
      createCanvas(windowWidth, windowHeight);
      player = new Player(width / 2, height / 2);
      for (let i = 0; i < 500; i++) {
        let objectType = floor(random(5)); // 0: Square, 1: Triangle, 2: Pentagon, 3: Hexagon, 4: Heptagon
        objects.push(new GameObject(random(1000), random(1000), objectType));
      }
    }

    function draw() {
      background(220);

      // Centrer la caméra sur le joueur
      translate(width / 2 - player.position.x, height / 2 - player.position.y);

      // Mise à jour de la position du joueur en fonction des forces appliquées
      player.update();

      // Vérifier les collisions avec les bords de l'écran
      player.checkEdges();

      // Appliquer les forces des objets sur le joueur
      for (let obj of objects) {
        obj.update();
        obj.checkEdges();
        
        // Vérifier les collisions entre le joueur et l'objet
        if (player.collide(obj)) {
          obj.pushedBy(player);
        }
      }

      // Afficher le joueur
      player.display();

      // Afficher les objets
      for (let obj of objects) {
        obj.display();
      }
    }

    class Player {
      constructor(x, y) {
        this.position = createVector(x, y);
        this.velocity = createVector();
        this.acceleration = createVector();
        this.size = 30;
      }

      applyForce(force) {
        // F = m * a => a = F / m
        // Ici, on ne tient pas compte de la masse, donc a = F
        this.acceleration.add(force);
      }

      update() {
        // Mise à jour de la vitesse en fonction de l'accélération
        this.velocity.add(this.acceleration);

        // Limiter la vitesse du joueur
        this.velocity.limit(maxPlayerSpeed);

        // Appliquer un amortissement lorsque la touche est relâchée pour que le joueur s'arrête progressivement
        if (!keyIsPressed) {
          this.velocity.mult(1 - airResistance);
        }

        // Mise à jour de la position en fonction de la vitesse
        this.position.add(this.velocity);

        // Remettre l'accélération à zéro à chaque mise à jour pour éviter une accumulation de forces
        this.acceleration.mult(0);
      }

      checkEdges() {
        // Gérer les collisions avec les bords de l'écran
        if (this.position.x < 0) {
          this.position.x = 0;
          this.velocity.x *= -0.5; // Rebondir légèrement sur le bord gauche
        } else if (this.position.x > 1000) {
          this.position.x = 1000;
          this.velocity.x *= -0.5; // Rebondir légèrement sur le bord droit
        }

        if (this.position.y < 0) {
          this.position.y = 0;
          this.velocity.y *= -0.5; // Rebondir légèrement sur le bord supérieur
        } else if (this.position.y > 1000) {
          this.position.y = 1000;
          this.velocity.y *= -0.5; // Rebondir légèrement sur le bord inférieur
        }
      }

      display() {
        // Dessiner le joueur comme un cercle
        fill(255, 0, 0);
        ellipse(this.position.x, this.position.y, this.size);
      }
      // Nouvelle méthode pour détecter les collisions entre le joueur et l'objet
      collide(object) {
        let distance = dist(this.position.x, this.position.y, object.position.x, object.position.y);
        return distance < (this.size / 2 + object.size / 2);
      }
    }

    class GameObject {
      constructor(x, y, type) {
        this.position = createVector(x, y);
        this.velocity = createVector();
        this.acceleration = createVector();
        this.type = type;
        this.size = 20;
      }

      pushedBy(player) {
        // Calculer la force exercée par le joueur sur l'objet lors de la collision
        let force = p5.Vector.sub(player.position, this.position);
        let distance = force.mag();
        let minDistance = player.size / 2 + this.size / 2;

        if (distance < minDistance) {
          force.normalize();
          force.mult(pushForce); // Modifier ce coefficient pour ajuster l'intensité du repoussement
          this.acceleration.add(force); // Appliquer la force à l'objet pour le déplacer
        }
      }

      update() {
        // Appliquer une force de frottement aux objets pour les ralentir progressivement
        let friction = this.velocity.copy();
        friction.mult(-1);
        friction.normalize();
        friction.mult(frictionCoefficient);
        this.velocity.add(friction);

        // Mise à jour de la position en fonction de la vitesse
        this.position.add(this.velocity);

        // Remettre l'accélération à zéro à chaque mise à jour pour éviter une accumulation de forces
        this.acceleration.mult(0);
      }

      checkEdges() {
        // Gérer les collisions avec les bords de l'écran
        if (this.position.x < 0 || this.position.x > 1000) {
          this.velocity.x *= -1; // Rebondir sur les bords horizontaux
        }

        if (this.position.y < 0 || this.position.y > 1000) {
          this.velocity.y *= -1; // Rebondir sur les bords verticaux
        }
      }

      display() {
        if (this.type === 0) {
          // Carré
          fill(255, 255, 0); // Jaune
          rect(this.position.x, this.position.y, this.size, this.size);
        } else if (this.type === 1) {
          // Triangle
          fill(255, 0, 0); // Rouge
          triangle(
            this.position.x, this.position.y - this.size,
            this.position.x - this.size, this.position.y + this.size,
            this.position.x + this.size, this.position.y + this.size
          );
        } else if (this.type === 2) {
          // Pentagon
          fill(0, 0, 255); // Bleu
          beginShape();
          for (let i = 0; i < 5; i++) {
            let angle = TWO_PI * i / 5;
            let x = this.position.x + this.size * cos(angle);
            let y = this.position.y + this.size * sin(angle);
            vertex(x, y);
          }
          endShape(CLOSE);
        } else if (this.type === 3) {
          // Hexagon
          fill(153, 102, 204); // Violet
          beginShape();
          for (let i = 0; i < 6; i++) {
            let angle = TWO_PI * i / 6;
            let x = this.position.x + this.size * cos(angle);
            let y = this.position.y + this.size * sin(angle);
            vertex(x, y);
          }
          endShape(CLOSE);
        } else if (this.type === 4) {
          // Heptagon
          fill(255, 165, 0); // Orange
          beginShape();
          for (let i = 0; i < 7; i++) {
            let angle = TWO_PI * i / 7;
            let x = this.position.x + this.size * cos(angle);
            let y = this.position.y + this.size * sin(angle);
            vertex(x, y);
          }
          endShape(CLOSE);
        } else if (this.type === 5) {
          // Octogone
          fill(0, 128, 0); // Vert
          beginShape();
          for (let i = 0; i < 8; i++) {
            let angle = TWO_PI * i / 8;
            let x = this.position.x + this.size * cos(angle);
            let y = this.position.y + this.size * sin(angle);
            vertex(x, y);
          }
          endShape(CLOSE);
        }
      }
    }

    function keyPressed() {
      // Appliquer une force en fonction de la touche pressée
      if (key === "z") {
        player.applyForce(createVector(0, -5));
        keyIsPressed = true;
      } else if (key === "s") {
        player.applyForce(createVector(0, 5));
        keyIsPressed = true;
      } else if (key === "q") {
        player.applyForce(createVector(-5, 0));
        keyIsPressed = true;
      } else if (key === "d") {
        player.applyForce(createVector(5, 0));
        keyIsPressed = true;
      }
    }

    function keyReleased() {
      // Réinitialiser keyIsPressed lorsque la touche est relâchée pour que le joueur puisse continuer à se déplacer en restant appuyé
      keyIsPressed = false;
    }
