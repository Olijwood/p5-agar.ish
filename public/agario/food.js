

function Food(x, y, r) {
    this.pos = createVector(x, y);
    this.r = r;

    this.constrain = function() {
        blob.pos.x = constrain(blob.pos.x, -width, width);
        blob.pos.y = constrain(blob.pos.y, -height, height);
    };

    this.eats = function(other) {
        const d = p5.Vector.dist(this.pos, other.pos);
        if (d < this.r + other.r) {
            const sum = PI * this.r * this.r + PI * other.r * other.r;
            this.r = sqrt(sum / PI);
            return true;
        }
        return false;
    };

    this.show = function() {
        fill(255);
        ellipse(this.pos.x, this.pos.y, this.r * 2, this.r * 2);
    };
}
