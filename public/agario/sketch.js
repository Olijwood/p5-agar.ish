let socket;
let blob;
let blobs = new Map();
let zoom = 1;
var food = [];

const boundary = new Rectangle(0, 0, 1000, 1000);
let qtree = new Quadtree(boundary, 4);

function setup() {
    createCanvas(600, 600); // This should create and attach a canvas to the DOM

    socket = io.connect('http://localhost:3000');

    blob = new Blobby(socket.id, floor(random(width)), floor(random(height)), floor(random(12, 36)));
    
    for (var i = 0; i < 50; i++) {
        var x = random(-width, width);
        var y = random(-height, height);
        food[i] = new Food(x, y, 16);
    }
    const data = {
        id: socket.id,
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
    };

    socket.emit('start', data);

    socket.on('heartbeat', (data) => {
        blobs.clear(); // Clear previous blobs
        data.forEach(blob => blobs.set(blob.id, blob));
        
        // Clear and repopulate the quadtree
        qtree = new Quadtree(boundary, 4);
        blobs.forEach(blob => {
            let point = { x: blob.x, y: blob.y, userData: blob };
            qtree.insert(point);
        });
    });
}

function draw() {
    background(220);

    translate(width / 2, height / 2);
    let newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for (var i = food.length - 1; i >= 0; i--) {
        food[i].show();
        if (blob.eats(food[i])) {
          food.splice(i, 1);
        }
    }

    let range = new Rectangle(blob.pos.x, blob.pos.y, blob.r * 2, blob.r * 2);
    let points = qtree.query(range);

    points.forEach(point => {
        let otherBlob = point.userData;
        if (otherBlob.id !== socket.id) {
            fill(0, 0, 255);
            // ellipse(otherBlob.x, otherBlob.y, otherBlob.r * 2, otherBlob.r * 2);
            let otherBlobby;
            otherBlobby = new Blobby(otherBlob.id, otherBlob.x, otherBlob.y, otherBlob.r, false);
            otherBlobby.show();

            fill(0);
            textAlign(CENTER);
            textSize(6);
            text(otherBlob.id, otherBlob.x, otherBlob.y + otherBlob.r * 1.5);
        }
    });

    blob.show();
    blob.update();
    blob.constrain();

    const data = {
        id: socket.id,
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
    };

    socket.emit('update', data);
}
