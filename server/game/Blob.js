class Blobby {
    constructor(id, x, y, r) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.r = r;
    }

    eat(food) {
        const newArea = Math.PI * this.r * this.r + Math.PI * food.r * food.r;
        this.r = Math.sqrt(newArea / Math.PI);
    }
}

export { Blobby };
