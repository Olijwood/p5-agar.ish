var socket;
var blob;
var id;

var blobs = [];
var zoom = 1;

function setup() {
  createCanvas(600, 600);

  socket = io.connect('http://localhost:3000');

  blob = new Blobby(floor(random(width)), floor(random(height)), floor(random(12, 36)));
  
  var data = {
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
  var newzoom = 64 / blob.r;
  zoom = lerp(zoom, newzoom, 0.1);
  scale(zoom);
  translate(-blob.pos.x, -blob.pos.y);

  for (var i = blobs.length - 1; i >= 0; i--) {
    var id = blobs[i].id;
    console.log(id);
    console.log(socket.id);
    if (id !== socket.id) {
      fill(0, 0, 255);
      ellipse(blobs[i].x, blobs[i].y, blobs[i].r*2, blobs[i].r*2);

      fill(0);
      textAlign(CENTER);
      textSize(6);
      text(blobs[i].id, blobs[i].x, blobs[i].y + blobs[i].r*1.5);
    }
    
    // blobs[i].show();
    // if (blob.eats(blobs[i])) {
    //   blobs.splice(i, 1);
    // }
  }

  blob.show();
  blob.update();
  blob.constrain();

  var data = {
    x: blob.pos.x,
    y: blob.pos.y,
    r: blob.r,
  };

  socket.emit('update', data);
}