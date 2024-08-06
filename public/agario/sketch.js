let socket;
let blob;
let blobs = new Map();
let zoom = 1;
let food = [];
let gameStarted = false; // Flag to check if the game has started

const boundary = new Rectangle(0, 0, 1000, 1000);
let qtree = new Quadtree(boundary, 4);

const startGame = () => {
    startGameButton.hide(); // Hide the button when the game starts
    buttonContainer.hide(); // Hide the container when the game starts

    // Initialize blob and other game setup
    blob = new Blobby(socket.id, floor(random(width)), floor(random(height)), floor(random(12, 36)));
    const data = {
        id: socket.id,
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
    };

    socket.emit('start', data);

    socket.on('heartbeat', (data) => {
        blobs.clear();
        data.blobs.forEach(blob => blobs.set(blob.id, blob));
        food = data.foodItems;
    
        if (blob) {
            const serverBlob = blobs.get(socket.id);
            if (serverBlob) {
                blob.r = serverBlob.r;
                blob.pos.x = serverBlob.x;
                blob.pos.y = serverBlob.y;
            }
        }
    
        qtree = new Quadtree(boundary, 4);
        blobs.forEach(blob => {
            let point = { x: blob.x, y: blob.y, userData: blob };
            qtree.insert(point);
        });
    });

    gameStarted = true; // Set the flag to true once game setup is complete
}

function setup() {
    createCanvas(600, 600);

    // Connect to the server
    socket = io.connect('http://localhost:3000');

    startGameButton = makeStartButton();
    startGameButton.mousePressed(startGame); // Attach event handler
}

function draw() {
    if (!gameStarted) {
        return; // If game hasn't started, skip drawing
    }

    if (!blob) {
        return; // Skip drawing if blob is not yet initialized
    }

    background(220);

    translate(width / 2, height / 2);
    let newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    // Render food items
    for (let i = food.length - 1; i >= 0; i--) {
        fill(255, 0, 0);
        ellipse(food[i].x, food[i].y, food[i].r * 2, food[i].r * 2);
    }

    // Render other blobs
    let range = new Rectangle(blob.pos.x, blob.pos.y, blob.r * 2, blob.r * 2);
    let points = qtree.query(range);

    points.forEach(point => {
        let otherBlob = point.userData;
        if (otherBlob.id !== socket.id) {
            let otherBlobby = new Blobby(otherBlob.id, otherBlob.x, otherBlob.y, otherBlob.r, false);
            otherBlobby.show();

            fill(0);
            textAlign(CENTER);
            textSize(otherBlob.r / 4);
            text(otherBlob.id, otherBlob.x, otherBlob.y + otherBlob.r * 1.5);
        }
    });

    // Render the user's own blob
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
