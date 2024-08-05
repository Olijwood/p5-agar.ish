function Blob(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);

    this.update = function() {
        var newVel = createVector(mouseX-width/2, mouseY-height/2);
        newVel.setMag(3);
        this.vel.lerp(newVel, 0.2);
        this.pos.add(this.vel);
    }

    this.eats = function(other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if (d < this.r + other.r) {
            var sum = PI * this.r * this.r + PI * other.r * other.r;
            this.r = sqrt(sum  / PI);
            return true;
        } else {
            return false;
        }
    }

    this.show = function() {
        fill(0, 150);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);
    }
}



function Blobby(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0, 0);

    this.update = function() {
        var newVel = createVector(mouseX - width / 2, mouseY - height / 2);
        newVel.setMag(3);
        this.vel.lerp(newVel, 0.2);
        this.pos.add(this.vel);
    }

    this.constrain = function() {
        blob.pos.x = constrain(blob.pos.x, -width, width)
        blob.pos.y = constrain(blob.pos.y, -height, height)
    }

    this.eats = function(other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if (d < this.r + other.r) {
            var sum = PI * this.r * this.r + PI * other.r * other.r;
            this.r = sqrt(sum  / PI);
            return true;
        } else {
            return false;
        }
    }

    this.show = function() {
        fill(0, 150);
        push();
        translate(this.pos.x, this.pos.y);
        beginShape();
        var angleStep = PI / 60;  // Smaller steps for more vertices
        var numHarmonics = 4;     // Number of harmonics
        var amplitude = 3;       // Amplitude of the waves

        for (var a = 0; a < TWO_PI; a += angleStep) {
            var r = this.r;
            for (var n = 1; n <= numHarmonics; n++) {
                var frequency = n;
                var phase = (n * frameCount * 0.025) % TWO_PI;
                r += amplitude * (1 / frequency) * sin(frequency * a + phase)/5;
            }
            var x = r * cos(a);
            var y = r * sin(a);
            vertex(x, y);
        }

        endShape(CLOSE);
        pop();
    }
}


