let socket;
let blob;
let blobs = [];
let zoom = 1;

function setup() {
    createCanvas(600, 600);

    socket = io.connect('http://localhost:3000');

    blob = new Blobby(floor(random(width)), floor(random(height)), floor(random(12, 36)));
    
    const data = {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
    };

    socket.emit('start', data);

    socket.on('heartbeat', (data) => {
        blobs = data;
    });
}

function draw() {
    background(220);

    translate(width / 2, height / 2);
    let newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for (let i = blobs.length - 1; i >= 0; i--) {
        if (blobs[i].id !== socket.id) {
            fill(0, 0, 255);
            ellipse(blobs[i].x, blobs[i].y, blobs[i].r * 2, blobs[i].r * 2);

            fill(0);
            textAlign(CENTER);
            textSize(6);
            text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r * 1.5);
        }
    }

    blob.show();
    blob.update();
    blob.constrain();

    const data = {
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
    };

    socket.emit('update', data);
}
